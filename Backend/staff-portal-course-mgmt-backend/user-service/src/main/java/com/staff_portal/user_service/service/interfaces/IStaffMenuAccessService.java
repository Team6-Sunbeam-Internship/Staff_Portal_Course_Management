package com.staff_portal.user_service.service.interfaces;

import com.staff_portal.user_service.dto.request.StaffMenuAccessCreateRequestDTO;
import com.staff_portal.user_service.dto.request.StaffMenuAccessDTO;
import com.staff_portal.user_service.dto.response.ApiResponse;

import java.util.List;
import java.util.UUID;

public interface IStaffMenuAccessService {

	StaffMenuAccessDTO createAccess(StaffMenuAccessDTO request);
	ApiResponse<List<StaffMenuAccessDTO>> getAllAccess();
	List<StaffMenuAccessDTO> getAccessByStaffId(UUID staffId);
    StaffMenuAccessDTO updateStatus(UUID id, String status);
    String deleteAccess(UUID id);
    List<StaffMenuAccessDTO> searchByStaffName(String name);

    ApiResponse<String> createOrUpdateExceptions(StaffMenuAccessCreateRequestDTO request);
}