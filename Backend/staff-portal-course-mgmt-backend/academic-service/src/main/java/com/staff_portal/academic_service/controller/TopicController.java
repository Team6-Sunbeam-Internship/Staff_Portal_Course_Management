package com.staff_portal.academic_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import com.staff_portal.academic_service.dto.request.TopicRequestDTO;
import com.staff_portal.academic_service.dto.response.CustomResponse;
import com.staff_portal.academic_service.dto.response.TopicResponseDTO;
import com.staff_portal.academic_service.service.interfaces.TopicService;

import lombok.RequiredArgsConstructor;
@CrossOrigin(origins = "http://localhost:5176")
@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    // Add Topic
    @PostMapping("/add")
    public ResponseEntity<?> addTopic(@RequestBody TopicRequestDTO requestDTO) {
        TopicResponseDTO response = topicService.addTopic(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>(false, "Topic Added Successfully!", response));
    }

    // Update Topic
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTopic(@PathVariable int id, @RequestBody TopicRequestDTO requestDTO) {
        TopicResponseDTO response = topicService.updateTopic(id, requestDTO);
        return ResponseEntity.ok(new CustomResponse<>(false, "Topic Updated Successfully!", response));
    }

    // Delete Topic
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable int id) {
        topicService.deleteTopic(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Topic Deleted Successfully!", null));
    }

    // Get All Topics
    @GetMapping
    public ResponseEntity<?> getAllTopics() {
        List<TopicResponseDTO> response = topicService.getAllTopics();
        return ResponseEntity.ok(new CustomResponse<>(false, "All Topics Fetched", response));
    }

    // Get Topic By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTopicById(@PathVariable int id) {
        TopicResponseDTO response = topicService.getTopicById(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Topic Found", response));
    }
    
    // ✅ Get Topics By Section (like SectionController)
    @GetMapping("/bySection/{sectionId}")
    public ResponseEntity<?> getTopicsBySection(@PathVariable int sectionId) {
        List<TopicResponseDTO> response = topicService.getTopicsBySection(sectionId);
        return ResponseEntity.ok(new CustomResponse<>(false, "Topics for Section fetched", response));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getTopicsByFilters(
            @RequestParam Integer batchCycleId,
            @RequestParam Integer courseTypeId,
            @RequestParam Integer courseId,
            @RequestParam Integer moduleId,
            @RequestParam Integer subjectId,
            @RequestParam Integer sectionId
    ) {
        List<TopicResponseDTO> response = topicService.getTopicsByFilters(
                batchCycleId, courseTypeId, courseId, moduleId, subjectId, sectionId
        );

        return ResponseEntity.ok(new CustomResponse<>(false, "Filtered Topics", response));
    }
}
