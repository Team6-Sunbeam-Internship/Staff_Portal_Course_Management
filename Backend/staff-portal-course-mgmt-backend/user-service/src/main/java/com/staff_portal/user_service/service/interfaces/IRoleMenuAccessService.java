package com.staff_portal.user_service.service.interfaces;

import com.staff_portal.user_service.dto.request.RoleMenuAccessDTO;
import com.staff_portal.user_service.dto.request.RoleMenuAccessUpdateReqDTO;
import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.dto.response.RoleMenuAccessUpdateStatusResponseDTO;

import java.util.List;

public interface IRoleMenuAccessService {

    ApiResponse<RoleMenuAccessUpdateStatusResponseDTO> updateRoleMenuAccessStatus(RoleMenuAccessUpdateReqDTO updateReq);

    ApiResponse<List<RoleMenuAccessDTO>> getAllRoleMenuAccessData();
//	List<RoleMenuAccessDTO> getAccessByRole(String roleName);
}
