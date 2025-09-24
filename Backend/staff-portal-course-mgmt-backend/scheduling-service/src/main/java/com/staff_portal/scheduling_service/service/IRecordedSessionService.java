package com.staff_portal.scheduling_service.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;

import com.staff_portal.scheduling_service.dto.request.RecordedSessionDTO;

import jakarta.validation.Valid;

public interface IRecordedSessionService {

	RecordedSessionDTO createSession(@Valid RecordedSessionDTO sessionDto);

	RecordedSessionDTO updateSession(Long id, @Valid RecordedSessionDTO sessionDto);

	RecordedSessionDTO getSessionById(Long id);

	boolean deleteSession(Long id);

	Page<RecordedSessionDTO> getSessionsByBatchCycleCourseAndDateRange(String batchCycleName, String courseName,
			LocalDate startDate, LocalDate endDate, int page, int size);

	List<RecordedSessionDTO> getAllRecordedSessions();

}
