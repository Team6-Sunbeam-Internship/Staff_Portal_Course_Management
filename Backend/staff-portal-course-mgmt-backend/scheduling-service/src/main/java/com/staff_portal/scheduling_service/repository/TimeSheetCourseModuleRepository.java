package com.staff_portal.scheduling_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.scheduling_service.model.TimeSheetCourseModule;

@Repository
public interface TimeSheetCourseModuleRepository extends JpaRepository<TimeSheetCourseModule,Long> {

}
