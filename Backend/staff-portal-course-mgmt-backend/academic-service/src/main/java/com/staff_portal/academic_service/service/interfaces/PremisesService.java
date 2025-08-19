package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.PremisesRequest;
import com.staff_portal.academic_service.dto.response.PremisesResponse;

public interface PremisesService {

	List<PremisesResponse> findAll();
    PremisesResponse findById(int id);
    PremisesResponse createPremises(PremisesRequest request);
    PremisesResponse updatePremises(int id, PremisesRequest request);
    void deletePremises(int id);
}
