package com.staff_portal.user_service.service.implementation;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.staff_portal.user_service.dto.request.StudentImportDTO;
import com.staff_portal.user_service.dto.response.ImportResponseDTO;
import com.staff_portal.user_service.enums.StudentStatus;
import com.staff_portal.user_service.model.Student;
import com.staff_portal.user_service.repository.StudentRepository;
import com.staff_portal.user_service.service.interfaces.IStudentImportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentImportServiceImpl implements IStudentImportService {

    private final StudentRepository studentRepository;

    public ImportResponseDTO importStudents(MultipartFile file) {
        List<String> errors = new ArrayList<>();
        List<StudentImportDTO> studentDTOs = new ArrayList<>();

        try {
            String fileName = file.getOriginalFilename();
            if (fileName == null) throw new IllegalArgumentException("File name cannot be null");

            if (fileName.toLowerCase().endsWith(".csv")) {
                studentDTOs = parseCSVFile(file);
            } else if (fileName.toLowerCase().endsWith(".xlsx") || fileName.toLowerCase().endsWith(".xls")) {
                studentDTOs = parseExcelFile(file);
            } else {
                throw new IllegalArgumentException("Unsupported file format. Please upload CSV or Excel file.");
            }

            return processStudentData(studentDTOs);

        } catch (Exception e) {
            errors.add("File processing error: " + e.getMessage());
            return ImportResponseDTO.builder()
                    .totalRecords(0).successfulImports(0).failedImports(0)
                    .errors(errors).successfulRegistrationNumbers(new ArrayList<>())
                    .failedRegistrationNumbers(new ArrayList<>()).message("Import failed").build();
        }
    }

    private List<StudentImportDTO> parseCSVFile(MultipartFile file) throws IOException, CsvException {
        List<StudentImportDTO> students = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            List<String[]> records = reader.readAll();

            for (int i = 1; i < records.size(); i++) {
                String[] record = records.get(i);
                if (record.length >= 7) {
                    StudentImportDTO student = StudentImportDTO.builder()
                            .registrationNumber(record[0].trim())
                            .studentName(record[1].trim())
                            .email(record[2].trim())
                            .mobileNumber(record[3].trim())
                            .address(record[4].trim())
                            .courseName(record[5].trim())
                            .batchCycleName(record[6].trim())
                            .build();
                    students.add(student);
                }
            }
        }
        return students;
    }

    private List<StudentImportDTO> parseExcelFile(MultipartFile file) throws IOException {
        List<StudentImportDTO> students = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row != null) {
                    StudentImportDTO student = StudentImportDTO.builder()
                            .registrationNumber(getCellValue(row.getCell(0)))
                            .studentName(getCellValue(row.getCell(1)))
                            .email(getCellValue(row.getCell(2)))
                            .mobileNumber(getCellValue(row.getCell(3)))
                            .address(getCellValue(row.getCell(4)))
                            .courseName(getCellValue(row.getCell(5)))
                            .batchCycleName(getCellValue(row.getCell(6)))
                            .build();
                    students.add(student);
                }
            }
        }
        return students;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue().trim();
            case NUMERIC: return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            default: return "";
        }
    }

    private ImportResponseDTO processStudentData(List<StudentImportDTO> studentDTOs) {
        List<String> errors = new ArrayList<>();
        List<Student> validStudents = new ArrayList<>();
        List<String> successful = new ArrayList<>();
        List<String> failed = new ArrayList<>();
        int successCount = 0;

        for (int i = 0; i < studentDTOs.size(); i++) {
            StudentImportDTO dto = studentDTOs.get(i);
            int row = i + 2;

            try {
                if (isBlank(dto.getRegistrationNumber()) || isBlank(dto.getStudentName()) ||
                    isBlank(dto.getEmail()) || isBlank(dto.getMobileNumber()) ||
                    isBlank(dto.getCourseName()) || isBlank(dto.getBatchCycleName())) {
                    errors.add("Row " + row + ": Missing required fields");
                    failed.add(dto.getRegistrationNumber() != null ? dto.getRegistrationNumber() : "UNKNOWN");
                    continue;
                }

                if (studentRepository.findByRegistrationNumber(dto.getRegistrationNumber()).isPresent()) {
                    errors.add("Row " + row + ": Registration exists - " + dto.getRegistrationNumber());
                    failed.add(dto.getRegistrationNumber());
                    continue;
                }

                if (studentRepository.findByEmail(dto.getEmail()).isPresent()) {
                    errors.add("Row " + row + ": Email exists - " + dto.getEmail());
                    failed.add(dto.getRegistrationNumber());
                    continue;
                }

                if (studentRepository.findByMobileNumber(dto.getMobileNumber()).isPresent()) {
                    errors.add("Row " + row + ": Mobile exists - " + dto.getMobileNumber());
                    failed.add(dto.getRegistrationNumber());
                    continue;
                }

                Student student = Student.builder()
                        .registrationNumber(dto.getRegistrationNumber())
                        .studentName(dto.getStudentName())
                        .email(dto.getEmail())
                        .mobileNumber(dto.getMobileNumber())
                        .address(dto.getAddress())
                        .courseName(dto.getCourseName())
                        .batchCycleName(dto.getBatchCycleName())
                        .status(StudentStatus.INACTIVE)
                        .isDeleted(false)
                        .build();

                validStudents.add(student);
                successful.add(dto.getRegistrationNumber());

            } catch (Exception e) {
                errors.add("Row " + row + ": " + e.getMessage());
                failed.add(dto.getRegistrationNumber() != null ? dto.getRegistrationNumber() : "UNKNOWN");
            }
        }

        if (!validStudents.isEmpty()) {
            try {
                List<Student> saved = studentRepository.saveAll(validStudents);
                successCount = saved.size();
            } catch (Exception e) {
                errors.add("Database error: " + e.getMessage());
                failed.addAll(successful);
                successful.clear();
                successCount = 0;
            }
        }

        return ImportResponseDTO.builder()
                .totalRecords(studentDTOs.size())
                .successfulImports(successCount)
                .failedImports(studentDTOs.size() - successCount)
                .errors(errors)
                .successfulRegistrationNumbers(successful)
                .failedRegistrationNumbers(failed)
                .message(successCount > 0 ? "Import completed" : "Import failed")
                .build();
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }
}
