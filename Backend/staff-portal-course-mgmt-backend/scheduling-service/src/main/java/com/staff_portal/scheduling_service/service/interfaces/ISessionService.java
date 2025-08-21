package com.staff_portal.scheduling_service.service.interfaces;

import java.util.List;

import com.staff_portal.scheduling_service.dto.request.SessionReqRespDTO;


public interface ISessionService {
	
	SessionReqRespDTO createSession(SessionReqRespDTO dto);
	
	List<SessionReqRespDTO> getAllSessions();
	
	SessionReqRespDTO getSessionById(Long id);
	
	SessionReqRespDTO updateSession(Long id,SessionReqRespDTO dto);
}
