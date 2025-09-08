package com.staff_portal.academic_service.controller;



import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.CustomResponse;
import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;
import com.staff_portal.academic_service.service.interfaces.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    //  Add Module
    @PostMapping("/add")
    public ResponseEntity<?> addModule(@RequestBody ModuleRequestDTO requestDTO) {
        ModuleResponseDTO response = moduleService.addModule(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>(false, "Module Added Successfully!", response));
    }

    // Update Module
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateModule(@PathVariable int id, @RequestBody ModuleRequestDTO requestDTO) {
        ModuleResponseDTO response = moduleService.updateModule(id, requestDTO);
        return ResponseEntity.ok(new CustomResponse<>(false, "Module Updated Successfully!", response));
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
