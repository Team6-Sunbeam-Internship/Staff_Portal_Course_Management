package com.staff_portal.user_service.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.staff_portal.user_service.dto.request.RoleMenuAccessDTO;
import com.staff_portal.user_service.service.interfaces.IRoleMenuAccessService;

@RestController
@RequestMapping("/api/role-menu-access")
@CrossOrigin
public class RoleMenuAccessController {

	@Autowired
	IRoleMenuAccessService roleMenuAccessService;

	@PostMapping("/create")
	public ResponseEntity<RoleMenuAccessDTO> create(@RequestBody RoleMenuAccessDTO request) {
		return ResponseEntity.ok(roleMenuAccessService.createRoleMenuAccess(request));
	}

	@PatchMapping("/updateStatus/{accessId}")
	public ResponseEntity<RoleMenuAccessDTO> updateStatus(@PathVariable Long accessId, @RequestParam String status) {
		return ResponseEntity.ok(roleMenuAccessService.updateRoleMenuAccessStatus(accessId, status));
	}

	@DeleteMapping("/delete/{accessId}")
	public ResponseEntity<String> delete(@PathVariable Long accessId) {
		return ResponseEntity.ok(roleMenuAccessService.deleteRoleMenuAccess(accessId));
	}

	@GetMapping("/getAll")
	public ResponseEntity<List<RoleMenuAccessDTO>> getAll() {
		return ResponseEntity.ok(roleMenuAccessService.getAllRoleMenuAccessData());
	}

	@GetMapping("/role/{roleName}")
	public ResponseEntity<List<RoleMenuAccessDTO>> getByRole(@PathVariable String roleName) {
		return ResponseEntity.ok(roleMenuAccessService.getAccessByRole(roleName));
	}

}
