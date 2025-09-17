package com.staff_portal.user_service.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.staff_portal.user_service.model.Staff;

public interface StaffRepository extends JpaRepository<Staff, UUID> {

	List<Staff> findAllByIsDeletedFalse();

	Optional<Staff> findByStaffIdAndIsDeletedFalse(UUID staffId);
	
//	@Query(value = """
//	        SELECT s.*
//	        FROM staff s
//	        WHERE s.is_deleted = false 
//	        AND (LOWER(s.first_name) LIKE LOWER(CONCAT('%', :name, '%'))
//	        OR LOWER(s.last_name) LIKE LOWER(CONCAT('%', :name, '%')))
//	        """, nativeQuery = true)
//	    List<Staff> searchByStaffName(@Param("name") String name);
	
	 @Query(value = """
		        SELECT s.*
		        FROM staff s
		        WHERE s.is_deleted = false 
		        AND (LOWER(s.first_name) LIKE LOWER(CONCAT('%', :name, '%'))
		        OR LOWER(s.last_name) LIKE LOWER(CONCAT('%', :name, '%'))
		        OR LOWER(CONCAT(s.first_name, ' ', s.last_name)) LIKE LOWER(CONCAT('%', :name, '%')))
		        """, nativeQuery = true)
		    List<Staff> searchByStaffName(@Param("name") String name);
}
