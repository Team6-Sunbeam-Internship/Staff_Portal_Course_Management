package com.staff_portal.user_service.repository;

import com.staff_portal.user_service.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {

    boolean existsByTitle(String title);

    @Query("""
            SELECT m FROM MenuItem m
            WHERE m.fullPathKey LIKE CONCAT(:fullPathKey, '/%')
            """)
    List<MenuItem> findAllDescendantsByFullPathKey(@Param("fullPathKey") String fullPathKey);

    Optional<MenuItem> findByFullPathKey(String childParentKey);
}
