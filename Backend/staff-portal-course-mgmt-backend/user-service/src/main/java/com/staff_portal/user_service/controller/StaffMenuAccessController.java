package com.staff_portal.user_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.staff_portal.user_service.dto.request.StaffMenuAccessDTO;
import com.staff_portal.user_service.service.interfaces.IStaffMenuAccessService;

@RestController
@RequestMapping("/api/staff-menu-access")
public class StaffMenuAccessController {

	@Autowired
	IStaffMenuAccessService staffMenuAccessService;

	@PostMapping("/create")
	public ResponseEntity<StaffMenuAccessDTO> create(@RequestBody StaffMenuAccessDTO request) {
		return ResponseEntity.ok(staffMenuAccessService.createAccess(request));
	}

	@GetMapping("/getAll")
	public ResponseEntity<List<StaffMenuAccessDTO>> getAll() {
		return ResponseEntity.ok(staffMenuAccessService.getAllAccess());
	}

	@GetMapping("/getStaff/{staffId}")
	public ResponseEntity<List<StaffMenuAccessDTO>> getByStaffId(@PathVariable String staffId) {
		return ResponseEntity.ok(staffMenuAccessService.getAccessByStaffId(staffId));
	}

	@PatchMapping("/updateStatus/{id}")
	public ResponseEntity<StaffMenuAccessDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
		return ResponseEntity.ok(staffMenuAccessService.updateStatus(id, status));
	}

		
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		staffMenuAccessService.deleteAccess(id);
		return ResponseEntity.noContent().build();
	}

}
