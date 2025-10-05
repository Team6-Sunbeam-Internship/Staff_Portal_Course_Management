package com.staff_portal.user_service.controller;

import com.staff_portal.user_service.dto.request.StudentDTO;
import com.staff_portal.user_service.dto.response.ImportResponseDTO;
import com.staff_portal.user_service.enums.StudentStatus;
import com.staff_portal.user_service.service.interfaces.IStudentImportService;
import com.staff_portal.user_service.service.interfaces.IStudentService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin
public class StudentController {

	@Autowired
    IStudentService studentService;
	
	@Autowired
	IStudentImportService studentImportService;
	
	@PostMapping("/import")
    public ResponseEntity<ImportResponseDTO> importStudents(@RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            ImportResponseDTO response = ImportResponseDTO.builder()
                    .totalRecords(0)
                    .successfulImports(0)
                    .failedImports(0)
                    .message("Please select a file to upload")
                    .build();
            return ResponseEntity.badRequest().body(response);
        }

        ImportResponseDTO result = studentImportService.importStudents(file);
        
        if (result.getSuccessfulImports() > 0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<StudentDTO> addStudent(@RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.addStudent(studentDTO));
    }

    // Update student
    @PutMapping("/update/{registrationNumber}")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable String registrationNumber,
            @RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(studentService.updateStudent(registrationNumber, studentDTO));
    }

    // Get ACTIVE students
    @GetMapping("/active")
    public ResponseEntity<List<StudentDTO>> getActiveStudents() {
        return ResponseEntity.ok(studentService.getStudentsByStatus(StudentStatus.ACTIVE));
    }

    // Get INACTIVE students
    @GetMapping("/inactive")
    public ResponseEntity<List<StudentDTO>> getInactiveStudents() {
        return ResponseEntity.ok(studentService.getStudentsByStatus(StudentStatus.INACTIVE));
    }

    // Get DELETED students
    @GetMapping("/deleted")
    public ResponseEntity<List<StudentDTO>> getDeletedStudents() {
        return ResponseEntity.ok(studentService.getDeletedStudents());
    }

    // Get ALL students (active + inactive + deleted)
    @GetMapping("/getAllStudents")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }
    
    @GetMapping("/by-course/{courseName}")
    public ResponseEntity<List<StudentDTO>> getStudentsByCourseName(@PathVariable String courseName) {
        return ResponseEntity.ok(studentService.getStudentsByCourseName(courseName));
    }

    @GetMapping("/by-batch-cycle/{batchCycleName}")
    public ResponseEntity<List<StudentDTO>> getStudentsByBatchCycleName(@PathVariable String batchCycleName) {
        return ResponseEntity.ok(studentService.getStudentsByBatchCycleName(batchCycleName));
    }

    // Delete student by registration number
    @DeleteMapping("/delete/{registrationNumber}")
    public ResponseEntity<String> softDeleteStudent(@PathVariable String registrationNumber) {
        studentService.deleteStudentByRegistrationNumber(registrationNumber);
        return ResponseEntity.ok("Student deleted successfully");
    }

    // Restore deleted student by registration number
    @PutMapping("/restore/{registrationNumber}")
    public ResponseEntity<String> restoreStudent(@PathVariable String registrationNumber) {
        studentService.restoreStudentByRegistrationNumber(registrationNumber);
        return ResponseEntity.ok("Student restored successfully");
    }

}
