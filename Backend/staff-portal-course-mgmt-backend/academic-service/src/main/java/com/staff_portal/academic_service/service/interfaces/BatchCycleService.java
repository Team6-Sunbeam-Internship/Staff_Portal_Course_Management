package com.staff_portal.academic_service.service.interfaces;

import java.util.List;
import java.util.UUID;

import com.staff_portal.academic_service.dto.request.BatchCycleRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.BatchCycleResponse;

public interface BatchCycleService {

    ApiResponse<List<BatchCycleResponse>> findAll();

    ApiResponse<BatchCycleResponse> createBatchCycle(BatchCycleRequest request);

    ApiResponse<String> updateBatchCycle(UUID id, BatchCycleRequest request);

    void deleteBatchCycle(UUID id);
}
