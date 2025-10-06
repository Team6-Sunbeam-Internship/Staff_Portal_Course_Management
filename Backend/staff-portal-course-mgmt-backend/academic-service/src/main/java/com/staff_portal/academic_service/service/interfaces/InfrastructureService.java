package com.staff_portal.academic_service.service.interfaces;

import java.util.List;
import java.util.UUID;

import com.staff_portal.academic_service.dto.request.InfrastructureRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.InfrastructureResponse;

public interface InfrastructureService {

    ApiResponse<UUID> createInfrastructure(InfrastructureRequest request);

    ApiResponse<String> updateInfrastructure(UUID id, InfrastructureRequest request);

    void deleteInfrastructure(UUID id);

    ApiResponse<List<InfrastructureResponse>> getAllInfrastructures();

}
