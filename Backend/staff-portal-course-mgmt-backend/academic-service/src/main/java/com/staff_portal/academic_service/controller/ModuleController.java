package com.staff_portal.academic_service.controller;


import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.service.interfaces.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @PutMapping("/update/{moduleId}")
    public ResponseEntity<ApiResponse<String>> updateModule(@PathVariable("moduleId") UUID moduleId, @RequestBody ModuleRequestDTO requestDTO) {
        ApiResponse<String> updateModuleResponse = moduleService.updateModule(moduleId, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(updateModuleResponse);
    }

    // Delete Module
    @DeleteMapping("/delete/{moduleId}")
    public ResponseEntity<?> deleteModule(@PathVariable("moduleId") UUID moduleId) {
        moduleService.deleteModule(moduleId);
        return ResponseEntity.ok().build();
    }
}
