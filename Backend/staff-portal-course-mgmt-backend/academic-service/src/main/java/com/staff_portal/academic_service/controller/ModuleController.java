package com.staff_portal.academic_service.controller;


import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;
import com.staff_portal.academic_service.service.interfaces.ModuleService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringEscapeUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/module")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    //  Add Module
    @PostMapping("/create/{courseCode}")
    public ResponseEntity<ApiResponse<UUID>> create(@PathVariable("courseCode") String courseCode, @RequestBody ModuleRequestDTO requestDTO) {
        ApiResponse<UUID> createResponse = moduleService.createModule(courseCode, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createResponse);
    }

    // Update Module
    @PutMapping("/update/{courseCode}/{moduleId}")
    public ResponseEntity<ApiResponse<String>> updateModule(@PathVariable("courseCode") String courseCode, @PathVariable("moduleId") UUID moduleId, @RequestBody ModuleRequestDTO requestDTO) {
        ApiResponse<String> updateModuleResponse = moduleService.updateModule(courseCode, moduleId, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(updateModuleResponse);
    }

    // Delete Module
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteModule(@PathVariable int id) {
        moduleService.deleteModule(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Module Deleted Successfully!", null));
    }

    //  Get All Modules
    @GetMapping
    public ResponseEntity<?> getAllModules() {
        List<ModuleResponseDTO> response = moduleService.getAllModules();
        return ResponseEntity.ok(new CustomResponse<>(false, "All Modules Fetched", response));
    }

    //  Get Module By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getModuleById(@PathVariable int id) {
        ModuleResponseDTO response = moduleService.getModuleById(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Module Found", response));
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getModulesByFilters(
            @RequestParam(required = false) Integer batchCycleId,
            @RequestParam(required = false) Integer courseTypeId,
            @RequestParam(required = false) Integer courseId) {

        List<ModuleResponseDTO> response = moduleService.getModulesByFilters(batchCycleId, courseTypeId, courseId);
        return ResponseEntity.ok(new CustomResponse<>(false, "Modules filtered by IDs", response));
    }
}
