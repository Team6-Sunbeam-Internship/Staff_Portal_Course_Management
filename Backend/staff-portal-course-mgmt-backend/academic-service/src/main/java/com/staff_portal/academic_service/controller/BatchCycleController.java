package com.staff_portal.academic_service.controller;

import com.staff_portal.academic_service.dto.request.BatchCycleRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.BatchCycleResponse;
import com.staff_portal.academic_service.service.interfaces.BatchCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/batch-cycle")
public class BatchCycleController {

    private final BatchCycleService service;

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<BatchCycleResponse>>> getAllBatchCycles() {
        ApiResponse<List<BatchCycleResponse>> allBatchCycles = service.findAllBatchCycles();
        return ResponseEntity.status(HttpStatus.OK).body(allBatchCycles);
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UUID>> create(@RequestBody BatchCycleRequest request) {
        ApiResponse<UUID> batchCycleCreateResponse = service.createBatchCycle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(batchCycleCreateResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<String>> update(@PathVariable UUID id, @RequestBody BatchCycleRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(service.updateBatchCycle(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        service.deleteBatchCycle(id);
        return ResponseEntity.noContent().build();
    }
}
