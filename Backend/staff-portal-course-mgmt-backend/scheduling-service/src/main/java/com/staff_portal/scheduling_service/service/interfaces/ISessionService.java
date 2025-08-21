package com.staff_portal.scheduling_service.service.interfaces;

import com.staff_portal.scheduling_service.dto.request.SessionReqRespDTO;


public interface ISessionService {
	
	SessionReqRespDTO createSession(SessionReqRespDTO dto);
	
  
}
