package com.staff_portal.user_service.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.staff_portal.user_service.enums.StudentStatus;
import com.staff_portal.user_service.model.Student;

public interface StudentRepository extends JpaRepository<Student, UUID> {

	Optional<Student> findByRegistrationNumber(String registrationNumber);

	// Active or Inactive students
	List<Student> findByStatusAndIsDeletedFalse(StudentStatus status);

	// Only deleted students
	List<Student> findByIsDeletedTrue();

	// All students (both deleted + active/inactive)
	List<Student> findAll();

	List<Student> findByCourseNameAndIsDeletedFalse(String courseName);

	List<Student> findByBatchCycleNameAndIsDeletedFalse(String batchCycleName);

	Optional<Student> findByEmail(String email);

	Optional<Student> findByMobileNumber(String mobileNumber);
}
