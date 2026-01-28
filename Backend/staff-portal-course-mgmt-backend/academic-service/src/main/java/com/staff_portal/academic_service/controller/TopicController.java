package com.staff_portal.academic_service.controller;

import com.staff_portal.academic_service.dto.request.TopicRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.service.interfaces.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/topic")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    // Add Topic
    @PostMapping("/create/{sectionId}")
    public ResponseEntity<ApiResponse<UUID>> createTopic(@PathVariable("sectionId") UUID sectionId, @RequestBody TopicRequestDTO requestDTO) {
        ApiResponse<UUID> createTopicResponse = topicService.createTopic(sectionId, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createTopicResponse);
    }

    // Update Topic
    @PutMapping("/update/{topicId}")
    public ResponseEntity<ApiResponse<String>> updateTopic(@PathVariable("topicId") UUID topicId, @RequestBody TopicRequestDTO requestDTO) {
        ApiResponse<String> updateTopicResponse = topicService.updateTopic(topicId, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(updateTopicResponse);
    }

    // Delete Topic
    @DeleteMapping("/delete/{topicId}")
    public ResponseEntity<?> deleteTopic(@PathVariable("topicId") UUID topicId) {
        topicService.deleteTopic(topicId);
        return ResponseEntity.ok().build();
    }
}
