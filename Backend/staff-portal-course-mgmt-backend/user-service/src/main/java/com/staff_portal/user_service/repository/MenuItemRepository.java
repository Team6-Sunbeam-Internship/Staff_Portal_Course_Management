package com.staff_portal.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.staff_portal.user_service.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

}
