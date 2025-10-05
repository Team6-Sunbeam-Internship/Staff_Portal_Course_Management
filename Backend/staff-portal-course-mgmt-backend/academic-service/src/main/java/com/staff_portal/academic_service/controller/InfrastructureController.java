package com.staff_portal.academic_service.controller;

import java.util.List;

import com.staff_portal.academic_service.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.academic_service.dto.request.InfrastructureRequest;
import com.staff_portal.academic_service.dto.response.InfrastructureResponse;
import com.staff_portal.academic_service.service.interfaces.InfrastructureService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/infrastructure")
@RequiredArgsConstructor
public class InfrastructureController {

    private final InfrastructureService infrastructureService;

    // Create Infrastructure
    @PostMapping
    public ResponseEntity<InfrastructureResponse> createInfrastructure(@RequestBody InfrastructureRequest request) {
        InfrastructureResponse response = infrastructureService.createInfrastructure(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // get Infrastructure
    @GetMapping("/{id}")
    public ResponseEntity<InfrastructureResponse> getInfrastructureById(@PathVariable int id) {
        return ResponseEntity.ok(infrastructureService.getInfrastructureById(id));
    }

    // updating the infrastructure
    @PutMapping("/{id}")
    public ResponseEntity<InfrastructureResponse> updateInfrastructure(@PathVariable int id,
                                                                       @RequestBody InfrastructureRequest request) {
        return ResponseEntity.ok(infrastructureService.updateInfrastructure(id, request));
    }

    // deleting the infrastructure
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInfrastructure(@PathVariable int id) {
        infrastructureService.deleteInfrastructure(id);
        return ResponseEntity.ok("Infrastructure deleted successfully with id: " + id);
    }

    // get all infrastructures
    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<InfrastructureResponse>>> getAllInfrastructures() {
        return ResponseEntity.ok(infrastructureService.getAllInfrastructures());
    }

}
