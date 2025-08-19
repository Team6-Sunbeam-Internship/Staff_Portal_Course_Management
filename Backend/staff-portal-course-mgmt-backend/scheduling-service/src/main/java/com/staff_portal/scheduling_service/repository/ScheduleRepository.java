package com.staff_portal.scheduling_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.scheduling_service.model.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	List<Schedule> findAll();

	

}
