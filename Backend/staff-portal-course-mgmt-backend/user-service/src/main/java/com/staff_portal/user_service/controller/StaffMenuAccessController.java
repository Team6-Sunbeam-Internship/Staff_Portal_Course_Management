package com.staff_portal.user_service.controller;

import java.util.List;
import java.util.UUID;

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
	
//	@GetMapping("/getStaff/{staffId}")
//	public ResponseEntity<List<StaffMenuAccessDTO>> getByStaffId(@PathVariable UUID staffId) {
//	    return ResponseEntity.ok(staffMenuAccessService.getAccessByStaffId(staffId));
//	}

	@GetMapping("/getStaff/{staffId}")
	public ResponseEntity<List<StaffMenuAccessDTO>> getByStaffId(@PathVariable String staffId) {
	    UUID uuid = parseUUID(staffId);
	    return ResponseEntity.ok(staffMenuAccessService.getAccessByStaffId(uuid));
	}
	
	@PatchMapping("/updateStatus/{staffAccessId}")
	public ResponseEntity<StaffMenuAccessDTO> updateStatus(@PathVariable UUID staffAccessId, 
	                                                       @RequestParam String status) {
	    return ResponseEntity.ok(staffMenuAccessService.updateStatus(staffAccessId, status));
	}

	@DeleteMapping("/delete/{staffAccessId}")
	public ResponseEntity<Void> delete(@PathVariable UUID staffAccessId) {
	    staffMenuAccessService.deleteAccess(staffAccessId);
	    return ResponseEntity.noContent().build();
	}
	
	private UUID parseUUID(String id) {
	    if (id.startsWith("0x") || id.startsWith("0X")) {
	        String hex = id.substring(2); // remove "0x"
	        if (hex.length() == 32) {
	            String formatted = String.format("%s-%s-%s-%s-%s",
	                hex.substring(0, 8),
	                hex.substring(8, 12),
	                hex.substring(12, 16),
	                hex.substring(16, 20),
	                hex.substring(20, 32)
	            );
	            return UUID.fromString(formatted);
	        } else {
	            throw new IllegalArgumentException("Invalid 0x UUID length: " + id);
	        }
	    }
	    return UUID.fromString(id);
	}


}
