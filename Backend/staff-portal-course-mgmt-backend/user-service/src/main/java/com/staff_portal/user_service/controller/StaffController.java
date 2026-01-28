package com.staff_portal.user_service.controller;

import com.staff_portal.user_service.dto.request.StaffDTO;
import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.dto.response.EligibleStaffResponseDTO;
import com.staff_portal.user_service.dto.response.StaffProfileResponseDTO;
import com.staff_portal.user_service.service.interfaces.IStaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
public class StaffController {

    private final IStaffService staffService;
    @Value("${bootstrap.key}")
    private String bootstrapKey;
    private final Environment environment;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<StaffDTO>>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UUID>> createStaff(@RequestBody StaffDTO staffDTO) {
        return ResponseEntity.ok(staffService.createStaff(staffDTO));
    }

    @PostMapping("/bootstrap")
    public ResponseEntity<Void> createDefaultAdmin(@RequestBody StaffDTO staffDTO, @RequestHeader("X-INTERNAL-KEY") String key) {
        if (!key.equals(bootstrapKey)) {
            throw new AccessDeniedException("Invalid bootstrap key");
        }
        if (!environment.acceptsProfiles(Profiles.of("dev"))) {
            throw new AccessDeniedException("Bootstrap is not allowed in this environment");
        }
        staffService.createStaff(staffDTO);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/delete/self")
    public ResponseEntity<ApiResponse<String>> deleteStaffSelf(Authentication authentication) {
        return ResponseEntity.ok(staffService.deleteStaffSelf(authentication));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/delete/byAdmin/{id}")
    public ResponseEntity<ApiResponse<String>> deleteStaffByAdmin(@PathVariable UUID userId) {
        return ResponseEntity.ok(staffService.deleteByAdmin(userId));
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/update")
    public ResponseEntity<ApiResponse<String>> updateStaff(@RequestBody StaffDTO staffDTO) {
        return ResponseEntity.ok(staffService.updateStaff(staffDTO));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StaffProfileResponseDTO>> getStaffProfile(Authentication authentication) {
        return ResponseEntity.ok(staffService.getStaffProfile(authentication));
    }

    // Get Eligible Staff
    // Eligible Staff ==> param = uniqueCourseNames + multiple
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/eligibleStaff")
    public ResponseEntity<ApiResponse<List<EligibleStaffResponseDTO>>> getEligibleStaff(
            @RequestParam(required = false) List<String> courseNames, @RequestParam(required = false) boolean multiple) {
        return ResponseEntity.ok(staffService.getEligibleStaff(courseNames, multiple));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/getStaffId")
    public ResponseEntity<ApiResponse<UUID>> getStaffId(Authentication authentication) {
        return ResponseEntity.ok(staffService.getStaffId(authentication));
    }
}
