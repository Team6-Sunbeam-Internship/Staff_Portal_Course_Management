package com.staff_portal.scheduling_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.scheduling_service.model.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long>  {

}
