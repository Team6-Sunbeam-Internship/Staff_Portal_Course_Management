package com.staff_portal.academic_service.controller;

import com.staff_portal.academic_service.dto.request.SectionRequestDTO;
import com.staff_portal.academic_service.dto.response.CustomResponse;
import com.staff_portal.academic_service.dto.response.SectionResponseDTO;
import com.staff_portal.academic_service.service.interfaces.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    //  Add Section
    @PostMapping("/add")
    public ResponseEntity<?> addSection(@RequestBody SectionRequestDTO requestDTO) {
        SectionResponseDTO response = sectionService.addSection(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>(false, "Section Added Successfully!", response));
    }

    //  Update Section
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSection(@PathVariable int id, @RequestBody SectionRequestDTO requestDTO) {
        SectionResponseDTO response = sectionService.updateSection(id, requestDTO);
        return ResponseEntity.ok(new CustomResponse<>(false, "Section Updated Successfully!", response));
    }

    //  Delete Section
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSection(@PathVariable int id) {
        sectionService.deleteSection(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Section Deleted Successfully!", null));
    }

    // Get All Sections
    @GetMapping
    public ResponseEntity<?> getAllSections() {
        List<SectionResponseDTO> response = sectionService.getAllSections();
        return ResponseEntity.ok(new CustomResponse<>(false, "All Sections Fetched", response));
    }

    // Get Section By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSectionById(@PathVariable int id) {
        SectionResponseDTO response = sectionService.getSectionById(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Section Found", response));
    }
    
    @GetMapping("/filter")
    public ResponseEntity<?> filterSections(
            @RequestParam Integer batchCycleId,
            @RequestParam String courseTypeId,
            @RequestParam Integer courseId,
            @RequestParam Integer moduleId,
            @RequestParam Integer subjectId
    ) {
        List<SectionResponseDTO> response = sectionService.filterSections(
                batchCycleId, courseTypeId, courseId, moduleId, subjectId
        );
        return ResponseEntity.ok(new CustomResponse<>(false, "Filtered Sections", response));
    }
}
