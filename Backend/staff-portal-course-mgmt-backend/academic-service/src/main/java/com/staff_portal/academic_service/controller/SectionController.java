package com.staff_portal.academic_service.controller;

import com.staff_portal.academic_service.dto.request.SectionRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.service.interfaces.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/section")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    //  Add Section
    @PostMapping("/create/{subjectId}")
    public ResponseEntity<ApiResponse<UUID>> createSection(@PathVariable("subjectId") UUID subjectId, @RequestBody SectionRequestDTO requestDTO) {
        ApiResponse<UUID> createSectionResponse = sectionService.createSection(subjectId, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createSectionResponse);
    }

    //  Update Section
    @PutMapping("/update/{sectionId}")
    public ResponseEntity<ApiResponse<String>> updateSection(@PathVariable("sectionId") UUID sectionId, @RequestBody SectionRequestDTO requestDTO) {
        ApiResponse<String> updateSectionResponse = sectionService.updateSection(sectionId, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(updateSectionResponse);
    }

    //  Delete Section
    @DeleteMapping("/delete/{sectionId}")
    public ResponseEntity<?> deleteSection( @PathVariable("sectionId") UUID sectionId) {
        sectionService.deleteSection(sectionId);
        return ResponseEntity.status(HttpStatus.OK).body("Section deleted successfully");
    }
}
