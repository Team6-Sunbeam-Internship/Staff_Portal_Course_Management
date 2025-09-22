package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.InfrastructureRequest;
import com.staff_portal.academic_service.dto.response.InfrastructureResponse;

public interface InfrastructureService {

	InfrastructureResponse createInfrastructure(InfrastructureRequest request);

	InfrastructureResponse getInfrastructureById(int id);

	InfrastructureResponse updateInfrastructure(int id, InfrastructureRequest request);

	void deleteInfrastructure(int id);

	List<InfrastructureResponse> getAllInfrastructures();

}
