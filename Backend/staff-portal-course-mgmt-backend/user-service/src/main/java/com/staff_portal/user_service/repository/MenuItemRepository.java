package com.staff_portal.user_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.staff_portal.user_service.model.MenuItem;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

	boolean existsByTitle(String title);
	
	 @Query("""
		        SELECT m 
		        FROM MenuItem m 
		        WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))
		    """)
		    List<MenuItem> searchByTitle(@Param("title") String title);
}
