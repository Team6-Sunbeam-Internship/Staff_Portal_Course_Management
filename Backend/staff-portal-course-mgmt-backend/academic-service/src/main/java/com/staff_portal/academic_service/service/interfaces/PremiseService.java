package com.staff_portal.academic_service.service.interfaces;

import java.util.List;
import java.util.UUID;
import com.staff_portal.academic_service.dto.request.PremiseRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.PremiseResponse;

public interface PremiseService {

    ApiResponse<List<PremiseResponse>> findAll();

	ApiResponse<UUID> createPremise(PremiseRequest request);

	PremiseResponse updatePremises(int id, PremiseRequest request);

	void deletePremises(int id);
}
