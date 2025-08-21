package com.staff_portal.scheduling_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

	    @GetMapping
	    public ResponseEntity<List<SessionReqRespDTO>> getAllSessions() {
	        List<SessionReqRespDTO> sessions = sessionService.getAllSessions();
	        return ResponseEntity.ok(sessions);
	    } 
	    
	    @GetMapping("/{id}")
	    public ResponseEntity<SessionReqRespDTO> getSessionById(@PathVariable Long id) {
	    	SessionReqRespDTO session = sessionService.getSessionById(id);
	        if (session != null) {
	            return ResponseEntity.ok(session);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	    
	    @PutMapping("/{id}")
	    public ResponseEntity<SessionReqRespDTO> updateSession(@PathVariable Long id, @RequestBody SessionReqRespDTO sessionDTO) {
	    	SessionReqRespDTO updatedSession = sessionService.updateSession(id, sessionDTO);
	        if (updatedSession != null) {
	            return ResponseEntity.ok(updatedSession);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
}
