package com.staff_portal.academic_service.controller;


import com.staff_portal.academic_service.dto.request.SubjectRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.service.interfaces.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/subject")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    //  Add Subject
    @PostMapping("/create/{moduleId}")
    public ResponseEntity<ApiResponse<UUID>> createSubject(@PathVariable("moduleId") UUID moduleId, @RequestBody SubjectRequestDTO requestDTO) {
        ApiResponse<UUID> createSubjectResponse = subjectService.createSubject(moduleId, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createSubjectResponse);
    }

    //  Update Subject
    @PutMapping("/update/{subjectId}")
    public ResponseEntity<ApiResponse<String>> updateSubject(@PathVariable("subjectId") UUID subjectId, @RequestBody SubjectRequestDTO requestDTO) {
        ApiResponse<String> updateSubjectResponse = subjectService.updateSubject(subjectId, requestDTO);
        return ResponseEntity.ok(updateSubjectResponse);
    }

    // Delete Subject
    @DeleteMapping("/delete/{subjectId}")
    public ResponseEntity<?> deleteSubject(@PathVariable("subjectId") UUID subjectId) {
        subjectService.deleteSubject(subjectId);
        return ResponseEntity.ok().build();
    }
}
