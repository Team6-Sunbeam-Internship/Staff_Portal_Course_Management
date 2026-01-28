package com.staff_portal.scheduling_service.service.interfaces;

import com.staff_portal.scheduling_service.dto.request.SessionReqRespDTO;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ISessionService {
	
	SessionReqRespDTO createSession(SessionReqRespDTO dto);
	
	List<SessionReqRespDTO> getAllSessions();
	
	SessionReqRespDTO getSessionById(UUID id);
	
	SessionReqRespDTO updateSession(UUID id,SessionReqRespDTO dto);
	
	boolean deleteSession(UUID id);

	Page<SessionReqRespDTO> getSessionsByBatchCycleCourseAndDateRange(String batchCycleName, String courseName,
			LocalDate startDate, LocalDate endDate, int page, int size);
}
