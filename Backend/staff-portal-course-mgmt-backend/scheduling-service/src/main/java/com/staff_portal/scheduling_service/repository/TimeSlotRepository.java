package com.staff_portal.scheduling_service.repository;


import com.staff_portal.scheduling_service.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, UUID> {


}
