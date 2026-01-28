package com.staff_portal.user_service.controller;

import com.staff_portal.user_service.dto.request.StaffMenuAccessCreateRequestDTO;
import com.staff_portal.user_service.dto.request.StaffMenuAccessDTO;
import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.service.interfaces.IStaffMenuAccessService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/staff-menu-access")
@CrossOrigin
public class StaffMenuAccessController {

	@Autowired
	IStaffMenuAccessService staffMenuAccessService;

	@PostMapping("/create")
	public ResponseEntity<StaffMenuAccessDTO> create(@RequestBody StaffMenuAccessDTO request) {
		return ResponseEntity.ok(staffMenuAccessService.createAccess(request));
	}

	@GetMapping("/getAll")
	public ResponseEntity<ApiResponse<List<StaffMenuAccessDTO>>> getAll() {
		return ResponseEntity.ok(staffMenuAccessService.getAllAccess());
	}
	
    @PostMapping("/create_update_exceptions")
    public ResponseEntity<ApiResponse<String>> createOrUpdateExceptions(@Valid @RequestBody StaffMenuAccessCreateRequestDTO request){
        return ResponseEntity.status(HttpStatus.CREATED).body(staffMenuAccessService.createOrUpdateExceptions(request));
    }

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
	
	@GetMapping("/search")
	public ResponseEntity<?> searchByStaffName(@RequestParam String name) {
	    try {
	        List<StaffMenuAccessDTO> results = staffMenuAccessService.searchByStaffName(name);
	        return ResponseEntity.ok(results);
	    } catch (ResourceNotFoundException ex) {
	        return ResponseEntity.status(404).body(ex.getMessage());
	    } catch (IllegalArgumentException ex) {
	        return ResponseEntity.badRequest().body(ex.getMessage());
	    } catch (Exception ex) {
	        return ResponseEntity.internalServerError().body(ex.getMessage());
	    }
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
