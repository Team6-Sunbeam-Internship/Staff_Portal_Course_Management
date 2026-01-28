package com.staff_portal.academic_service.service.interfaces;

import com.staff_portal.academic_service.dto.request.BatchCycleRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.BatchCycleResponse;

import java.util.List;
import java.util.UUID;

public interface BatchCycleService {

    ApiResponse<List<BatchCycleResponse>> findAllBatchCycles();

    ApiResponse<UUID> createBatchCycle(BatchCycleRequest request);

    ApiResponse<String> updateBatchCycle(UUID id, BatchCycleRequest request);

    void deleteBatchCycle(UUID id);
}
