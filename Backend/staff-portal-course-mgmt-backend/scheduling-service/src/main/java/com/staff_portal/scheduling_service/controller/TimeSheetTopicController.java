package com.staff_portal.scheduling_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetTopicResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetTopicService;

import jakarta.validation.Valid;
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
    public ResponseEntity<TimeSheetTopicResponseDTO> getById(@PathVariable Long id) {
        TimeSheetTopicResponseDTO responseDto = TimeSheetTopicService.getTimeSheetTopicById(id);
        return ResponseEntity.ok(responseDto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TimeSheetTopicResponseDTO> update(@PathVariable Long id,
                                                            @Valid @RequestBody TimeSheetTopicRequestDTO requestDto) {
        TimeSheetTopicResponseDTO responseDto = TimeSheetTopicService.updateTimeSheetTopic(id, requestDto);
        return ResponseEntity.ok(responseDto);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        TimeSheetTopicService.deleteTimeSheetTopic(id);
        return ResponseEntity.noContent().build();
    }

}
