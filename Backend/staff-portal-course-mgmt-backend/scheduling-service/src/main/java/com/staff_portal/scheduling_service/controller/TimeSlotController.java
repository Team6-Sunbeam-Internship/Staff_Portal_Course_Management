package com.staff_portal.scheduling_service.controller;

import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSlotResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSlotService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/timeslot")
public class TimeSlotController {

    @Autowired
    private ITimeSlotService timeSlotService;

    @GetMapping
    public ResponseEntity<List<TimeSlotResponseDTO>> getAll() {
        List<TimeSlotResponseDTO> list = timeSlotService.getAllTimeSlots();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeSlotResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(timeSlotService.getTimeSlotById(id));
    }

    @PostMapping
    public ResponseEntity<TimeSlotResponseDTO> create(@Valid @RequestBody TimeSlotRequestDTO dto) {
        return ResponseEntity.ok(timeSlotService.createTimeSlot(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeSlotResponseDTO> update(@PathVariable UUID id,
                                                      @Valid @RequestBody TimeSlotRequestDTO dto) {
        return ResponseEntity.ok(timeSlotService.updateTimeSlot(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        timeSlotService.deleteTimeSlot(id);
        return ResponseEntity.noContent().build();
    }
}
