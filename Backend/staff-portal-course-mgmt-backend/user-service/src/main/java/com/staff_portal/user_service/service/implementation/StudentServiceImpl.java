package com.staff_portal.user_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.user_service.dto.request.StudentDTO;
import com.staff_portal.user_service.enums.StudentStatus;
import com.staff_portal.user_service.model.Student;
import com.staff_portal.user_service.repository.StudentRepository;
import com.staff_portal.user_service.service.interfaces.IStudentService;

@Service
public class StudentServiceImpl implements IStudentService {

	@Autowired
	StudentRepository studentRepository;
	
	@Override
	public StudentDTO addStudent(StudentDTO studentDTO) {
	    Student student = Student.builder()
	            .registrationNumber(studentDTO.getRegistrationNumber())
	            .studentName(studentDTO.getStudentName())
	            .email(studentDTO.getEmail())
	            .mobileNumber(studentDTO.getMobileNumber())
	            .address(studentDTO.getAddress())
	            .batchCycleName(studentDTO.getBatchCycleName())
                .courseName(studentDTO.getCourseName())
	            .status(studentDTO.getStatus())
	            .build();

	    Student saved = studentRepository.save(student);
	    return mapToDTO(saved);
	}

    @Override
    public StudentDTO updateStudent(String registrationNumber, StudentDTO studentDTO) {
        Student existing = studentRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new RuntimeException("Student not found with registration number: " + registrationNumber));

        existing.setStudentName(studentDTO.getStudentName());
        existing.setEmail(studentDTO.getEmail());
        existing.setMobileNumber(studentDTO.getMobileNumber());
        existing.setAddress(studentDTO.getAddress());
        existing.setBatchCycleName(studentDTO.getBatchCycleName());
        existing.setCourseName(studentDTO.getCourseName());
        existing.setStatus(studentDTO.getStatus());

        Student updated = studentRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public List<StudentDTO> getStudentsByStatus(StudentStatus status) {
        return studentRepository.findByStatusAndIsDeletedFalse(status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getDeletedStudents() {
        return studentRepository.findByIsDeletedTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteStudentByRegistrationNumber(String registrationNumber) {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new RuntimeException("Student not found with registration number: " + registrationNumber));

        student.setDeleted(true);
        studentRepository.save(student);
    }

    @Override
    public void restoreStudentByRegistrationNumber(String registrationNumber) {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new RuntimeException("Student not found with registration number: " + registrationNumber));

        student.setDeleted(false);
        studentRepository.save(student);
    }

    private StudentDTO mapToDTO(Student student) {
        return StudentDTO.builder()
                .registrationNumber(student.getRegistrationNumber())
                .studentName(student.getStudentName())
                .email(student.getEmail())
                .mobileNumber(student.getMobileNumber())
                .address(student.getAddress())
                .batchCycleName(student.getBatchCycleName())
                .courseName(student.getCourseName())         
                .status(student.getStatus())
                .isDeleted(student.isDeleted())
                .build();
    }
}
