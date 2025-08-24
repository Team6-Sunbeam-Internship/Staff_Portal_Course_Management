package com.staff_portal.user_service.service.interfaces;

import java.util.List;

import com.staff_portal.user_service.dto.request.StudentDTO;
import com.staff_portal.user_service.enums.StudentStatus;

public interface IStudentService {

	StudentDTO addStudent(StudentDTO studentDTO);

	StudentDTO updateStudent(String registrationNumber, StudentDTO studentDTO);

	List<StudentDTO> getStudentsByStatus(StudentStatus status);

	List<StudentDTO> getDeletedStudents();

	List<StudentDTO> getAllStudents();

	void deleteStudentByRegistrationNumber(String registrationNumber);

	void restoreStudentByRegistrationNumber(String registrationNumber);
}
