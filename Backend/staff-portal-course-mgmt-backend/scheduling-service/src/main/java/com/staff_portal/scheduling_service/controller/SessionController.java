package com.staff_portal.scheduling_service.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.scheduling_service.dto.request.SessionReqRespDTO;
import com.staff_portal.scheduling_service.service.interfaces.ISessionService;

import jakarta.validation.Valid;

import jakarta.validation.Valid;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

	 @Autowired
	    private ISessionService sessionService;

	 
	    @PostMapping
	    public ResponseEntity<SessionReqRespDTO> createSession(@Valid @RequestBody SessionReqRespDTO sessionDTO) {
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
	    public ResponseEntity<SessionReqRespDTO> updateSession(@PathVariable Long id,@Valid @RequestBody SessionReqRespDTO sessionDTO) {
	    	SessionReqRespDTO updatedSession = sessionService.updateSession(id, sessionDTO);
	        if (updatedSession != null) {
	            return ResponseEntity.ok(updatedSession);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	    
	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
	        boolean deleted = sessionService.deleteSession(id);
	        if (deleted) {
	            return ResponseEntity.noContent().build();
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	    
	    @GetMapping("/by-date")
		public ResponseEntity<Page<SessionReqRespDTO>> getSessionsByBatchCycleCourseAndDateRange(
				@RequestParam String batchCycleName,
				@RequestParam String courseName,
				@RequestParam LocalDate startDate,
				@RequestParam LocalDate endDate,
				@RequestParam(defaultValue = "0") int page,
				@RequestParam(defaultValue = "8") int size) {



			Page<SessionReqRespDTO> sessions = sessionService.getSessionsByBatchCycleCourseAndDateRange(
					batchCycleName, courseName, startDate, endDate, page, size);

			return ResponseEntity.ok(sessions);
		}
}
