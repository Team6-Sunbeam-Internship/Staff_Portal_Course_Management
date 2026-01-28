package com.staff_portal.user_service.repository;

import com.staff_portal.user_service.model.StaffMenuAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface StaffMenuAccessRepository extends JpaRepository<StaffMenuAccess, UUID> {

    List<StaffMenuAccess> findByStaffStaffId(UUID staffId);

    @Query(value = """
               SELECT s.* 
               FROM staff_menu_access s
               JOIN staff st ON s.staff_id = st.staff_id
               WHERE LOWER(st.first_name) LIKE LOWER(CONCAT('%', :name, '%'))
                  OR LOWER(st.last_name) LIKE LOWER(CONCAT('%', :name, '%'))
            """, nativeQuery = true)
    List<StaffMenuAccess> searchByStaffName(@Param("name") String name);

    @Query("SELECT sma FROM StaffMenuAccess sma WHERE sma.staff.staffId = :staffId")
    List<StaffMenuAccess> findStaffAccessByStaffId(@Param("staffId") UUID staffId);


    List<StaffMenuAccess> findByStaffStaffIdAndMenuItemIdIn(UUID staffId, Collection<UUID> menuItemIds);
}