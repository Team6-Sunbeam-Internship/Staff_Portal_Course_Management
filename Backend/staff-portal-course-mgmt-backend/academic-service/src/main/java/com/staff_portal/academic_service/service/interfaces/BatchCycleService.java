package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.BatchCycleRequest;
import com.staff_portal.academic_service.dto.response.BatchCycleResponse;

public interface BatchCycleService {

	   
	    List<BatchCycleResponse> findAll();
	    BatchCycleResponse createBatchCycle(BatchCycleRequest request);
}
