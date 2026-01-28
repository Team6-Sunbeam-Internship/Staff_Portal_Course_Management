package com.staff_portal.user_service.service.interfaces;

import com.staff_portal.user_service.dto.request.StaffDTO;
import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.dto.response.EligibleStaffResponseDTO;
import com.staff_portal.user_service.dto.response.StaffProfileResponseDTO;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

public interface IStaffService {

    ApiResponse<UUID> createStaff(StaffDTO staffDTO);

    ApiResponse<StaffProfileResponseDTO> getStaffProfile(Authentication authentication);

    ApiResponse<List<StaffDTO>> getAllStaff();

    ApiResponse<String> updateStaff(StaffDTO staffDTO);

    ApiResponse<String> deleteStaffSelf(Authentication authentication);

    ApiResponse<String> deleteByAdmin(UUID staffId);

    ApiResponse<List<EligibleStaffResponseDTO>> getEligibleStaff(List<String> courseSpecialization, boolean multiple);

    ApiResponse<UUID> getStaffId(Authentication authentication);
}
