package com.staff_portal.scheduling_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.scheduling_service.dto.request.SessionReqRespDTO;
import com.staff_portal.scheduling_service.service.interfaces.ISessionService;

@RestController
@RequestMapping("/sessions")
public class SessionController {

	 @Autowired
	    private ISessionService sessionService;

	 
	    @PostMapping
	    public ResponseEntity<SessionReqRespDTO> createSession(@RequestBody SessionReqRespDTO sessionDTO) {
	    	SessionReqRespDTO createdSession = sessionService.createSession(sessionDTO);
	        return ResponseEntity.ok(createdSession);
	    }

	    
}
