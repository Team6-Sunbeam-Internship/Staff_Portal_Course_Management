package com.staff_portal.user_service.service.interfaces;

import java.util.List;

import com.staff_portal.user_service.dto.request.RoleMenuAccessDTO;

public interface IRoleMenuAccessService {

	RoleMenuAccessDTO createRoleMenuAccess(RoleMenuAccessDTO request);
	RoleMenuAccessDTO updateRoleMenuAccessStatus(Long accessId, String newStatus);
	String deleteRoleMenuAccess(Long accessId);
	List<RoleMenuAccessDTO> getAllRoleMenuAccessData();
}
