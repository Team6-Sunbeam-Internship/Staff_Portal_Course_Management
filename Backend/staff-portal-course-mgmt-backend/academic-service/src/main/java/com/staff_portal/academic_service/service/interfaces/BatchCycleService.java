package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.BatchCycleRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.BatchCycleResponse;

public interface BatchCycleService {

	ApiResponse<List<BatchCycleResponse>> findAll();

	ApiResponse<BatchCycleResponse> createBatchCycle(BatchCycleRequest request);

	BatchCycleResponse findById(int id);

	BatchCycleResponse updateBatchCycle(int id, BatchCycleRequest request);

	void deleteBatchCycle(int id);

}
