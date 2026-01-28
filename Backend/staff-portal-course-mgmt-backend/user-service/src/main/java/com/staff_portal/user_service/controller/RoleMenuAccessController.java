package com.staff_portal.user_service.controller;

import com.staff_portal.user_service.dto.request.RoleMenuAccessDTO;
import com.staff_portal.user_service.dto.request.RoleMenuAccessUpdateReqDTO;
import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.dto.response.RoleMenuAccessUpdateStatusResponseDTO;
import com.staff_portal.user_service.service.interfaces.IRoleMenuAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role-menu-access")
public class RoleMenuAccessController {

	@Autowired
	IRoleMenuAccessService roleMenuAccessService;


	@PatchMapping("/updateStatus")
	public ResponseEntity<ApiResponse<RoleMenuAccessUpdateStatusResponseDTO>> updateStatus(@RequestBody RoleMenuAccessUpdateReqDTO updateReq) {
		return ResponseEntity.ok(roleMenuAccessService.updateRoleMenuAccessStatus(updateReq));
	}

	@GetMapping("/getAll")
	public ResponseEntity<ApiResponse<List<RoleMenuAccessDTO>>> getAll() {
		return ResponseEntity.ok(roleMenuAccessService.getAllRoleMenuAccessData());
	}
//	@GetMapping("/role/{roleName}")
//	public ResponseEntity<List<RoleMenuAccessDTO>> getByRole(@PathVariable String roleName) {
//		return ResponseEntity.ok(roleMenuAccessService.getAccessByRole(roleName));
//	}
}
