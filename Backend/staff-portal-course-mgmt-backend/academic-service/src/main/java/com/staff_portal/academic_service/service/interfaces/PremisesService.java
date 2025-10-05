package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.PremisesRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.PremiseResponse;

public interface PremisesService {

    ApiResponse<List<PremiseResponse>> findAll();

	PremiseResponse createPremises(PremisesRequest request);

	PremiseResponse updatePremises(int id, PremisesRequest request);

	void deletePremises(int id);
}
