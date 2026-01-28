package com.staff_portal.academic_service.service.interfaces;

import java.util.List;
import java.util.UUID;
import com.staff_portal.academic_service.dto.request.PremiseRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.PremiseResponse;

public interface PremiseService {

    ApiResponse<List<PremiseResponse>> findAll();

	ApiResponse<UUID> createPremise(PremiseRequestDTO request);

	ApiResponse<String> updatePremise(UUID id, PremiseRequestDTO request);

	void deletePremise(UUID id);
}
