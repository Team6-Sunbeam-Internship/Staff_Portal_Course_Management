package com.staff_portal.user_service.controller;

import java.util.List;
import java.util.UUID;

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

import com.staff_portal.user_service.dto.request.StaffDTO;
import com.staff_portal.user_service.service.interfaces.IStaffService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@CrossOrigin
public class StaffController {

    private final IStaffService staffService;

    @PostMapping("/createStaff")
    public ResponseEntity<StaffDTO> createStaff(@RequestBody StaffDTO staffDTO) {
        return ResponseEntity.ok(staffService.createStaff(staffDTO));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<StaffDTO>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/getStaffById/{id}")
    public ResponseEntity<StaffDTO> getStaffById(@PathVariable String id) {
        UUID uuid = parseUUID(id);
        return ResponseEntity.ok(staffService.getStaffById(uuid));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable String id) {
        UUID uuid = parseUUID(id);
        String message = staffService.deleteStaff(uuid);
        return ResponseEntity.ok(message);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<StaffDTO> updateStaff(@PathVariable String id, @RequestBody StaffDTO staffDTO) {
        UUID uuid = parseUUID(id);
        return ResponseEntity.ok(staffService.updateStaff(uuid, staffDTO));
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchStaffByName(@RequestParam String name) {
        try {
            List<StaffDTO> results = staffService.searchStaffByName(name);
            if (results.isEmpty()) {
                return ResponseEntity.status(404).body("No staff record found for name: " + name);
            }
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Failed to search staff");
        }
    }

    private UUID parseUUID(String id) {
        if (id.startsWith("0x") || id.startsWith("0X")) {
            String hex = id.substring(2).toLowerCase();
            if (hex.length() == 32) {
                String formatted = String.format("%s-%s-%s-%s-%s",
                        hex.substring(0, 8),
                        hex.substring(8, 12),
                        hex.substring(12, 16),
                        hex.substring(16, 20),
                        hex.substring(20, 32));
                return UUID.fromString(formatted);
            }
        }
        return UUID.fromString(id);
    }
    
}
