package com.staff_portal.academic_service.controller;


import com.staff_portal.academic_service.dto.request.SubjectRequestDTO;
import com.staff_portal.academic_service.dto.response.SubjectResponseDTO;
import com.staff_portal.academic_service.service.interfaces.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/subject")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    //  Add Subject
    @PostMapping("/add")
    public ResponseEntity<?> addSubject(@RequestBody SubjectRequestDTO requestDTO) {
        SubjectResponseDTO response = subjectService.addSubject(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>(false, "Subject Added Successfully!", response));
    }

    //  Update Subject
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable int id, @RequestBody SubjectRequestDTO requestDTO) {
        SubjectResponseDTO response = subjectService.updateSubject(id, requestDTO);
        return ResponseEntity.ok(new CustomResponse<>(false, "Subject Updated Successfully!", response));
    }

    // Delete Subject
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable int id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Subject Deleted Successfully!", null));
    }

    //  Get All Subjects
    @GetMapping
    public ResponseEntity<?> getAllSubjects() {
        List<SubjectResponseDTO> response = subjectService.getAllSubjects();
        return ResponseEntity.ok(new CustomResponse<>(false, "All Subjects Fetched", response));
    }

    //  Get Subject By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubjectById(@PathVariable int id) {
        SubjectResponseDTO response = subjectService.getSubjectById(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Subject Found", response));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getSubjectsByFilters(
            @RequestParam Integer batchCycleId,
            @RequestParam Integer courseTypeId,
            @RequestParam Integer courseId,
            @RequestParam Integer moduleId) {

        List<SubjectResponseDTO> response = subjectService.getSubjectsByFilters(batchCycleId, courseTypeId, courseId, moduleId);
        return ResponseEntity.ok(new CustomResponse<>(false, "Subjects fetched successfully", response));
    }
}
