package com.staff_portal.scheduling_service.controller;

import com.staff_portal.scheduling_service.dto.request.RecordedSessionDTO;
import com.staff_portal.scheduling_service.service.IRecordedSessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/recorded-sessions")
public class RecordedSessionController {

    @Autowired
    private IRecordedSessionService recordedSessionService;

    @PostMapping
    public ResponseEntity<?> createSession(@Valid @RequestBody RecordedSessionDTO sessionDto) {
        try {

            RecordedSessionDTO createdSession = recordedSessionService.createSession(sessionDto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Recorded session created successfully");
            response.put("data", createdSession);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRecordedSessions() {
        List<RecordedSessionDTO> list = recordedSessionService.getAllRecordedSessions();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable UUID id,
                                           @Valid @RequestBody RecordedSessionDTO sessionDto) {
        try {

            RecordedSessionDTO updatedSession = recordedSessionService.updateSession(id, sessionDto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Recorded session updated successfully");
            response.put("data", updatedSession);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionById(@PathVariable UUID id) {
        try {

            RecordedSessionDTO session = recordedSessionService.getSessionById(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", session);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable UUID id) {
        try {

            recordedSessionService.deleteSession(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Recorded session deleted successfully");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/by-date")
    public ResponseEntity<Page<RecordedSessionDTO>> getSessionsByBatchCycleCourseAndDateRange(
            @RequestParam String batchCycleName,
            @RequestParam String courseName,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {


        Page<RecordedSessionDTO> sessions = recordedSessionService.getSessionsByBatchCycleCourseAndDateRange(
                batchCycleName, courseName, startDate, endDate, page, size);

        return ResponseEntity.ok(sessions);
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now());
        return response;
    }


}


