package com.staff_portal.academic_service.controller;

import java.util.List;
import java.util.UUID;

import com.staff_portal.academic_service.dto.response.ApiResponse;
import org.hibernate.engine.jdbc.batch.spi.Batch;
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

import com.staff_portal.academic_service.dto.request.BatchCycleRequest;
import com.staff_portal.academic_service.dto.response.BatchCycleResponse;
import com.staff_portal.academic_service.service.interfaces.BatchCycleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/batch-cycle")
public class BatchCycleController {

    private final BatchCycleService service;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<BatchCycleResponse>> create(@RequestBody BatchCycleRequest request) {
        ApiResponse<BatchCycleResponse> batchCycleCreateResponse = service.createBatchCycle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(batchCycleCreateResponse);
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<BatchCycleResponse>>> getAllBatchCycles() {
        ApiResponse<List<BatchCycleResponse>> allBatchCycles = service.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(allBatchCycles);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<String>> update(@PathVariable String id, @RequestBody BatchCycleRequest request) {
        UUID uuid = UUID.fromString(id);
        return ResponseEntity.status(HttpStatus.OK).body(service.updateBatchCycle(uuid, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        service.deleteBatchCycle(UUID.fromString(id));
        return ResponseEntity.ok("BatchCycle deleted successfully!");
    }
}
