package com.staff_portal.scheduling_service.controller;

import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetTopicResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetTopicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/timesheettopics")
public class TimeSheetTopicController {

    @Autowired
    private ITimeSheetTopicService TimeSheetTopicService;

    @PostMapping
    public ResponseEntity<TimeSheetTopicResponseDTO> create(@Valid @RequestBody TimeSheetTopicRequestDTO requestDto) {
        TimeSheetTopicResponseDTO responseDto = TimeSheetTopicService.createTimeSheetTopic(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<TimeSheetTopicResponseDTO>> getAll() {
        List<TimeSheetTopicResponseDTO> topics = TimeSheetTopicService.getAllTimeSheetTopic();
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeSheetTopicResponseDTO> getById(@PathVariable UUID id) {
        TimeSheetTopicResponseDTO responseDto = TimeSheetTopicService.getTimeSheetTopicById(id);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeSheetTopicResponseDTO> update(@PathVariable UUID id,
                                                            @Valid @RequestBody TimeSheetTopicRequestDTO requestDto) {
        TimeSheetTopicResponseDTO responseDto = TimeSheetTopicService.updateTimeSheetTopic(id, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        TimeSheetTopicService.deleteTimeSheetTopic(id);
        return ResponseEntity.noContent().build();
    }

}
