package com.staff_portal.user_service.service.implementation;

import com.staff_portal.user_service.dto.request.StaffDTO;
import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.dto.response.EligibleStaffResponseDTO;
import com.staff_portal.user_service.dto.response.StaffProfileResponseDTO;
import com.staff_portal.user_service.exception.ResourceAlreadyExistException;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.model.Staff;
import com.staff_portal.user_service.repository.StaffRepository;
import com.staff_portal.user_service.service.interfaces.IStaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffServiceImpl implements IStaffService {

    private final StaffRepository staffRepository;

    @Override
    public ApiResponse<UUID> createStaff(StaffDTO staffDTO) {

        if (staffRepository.existsById(staffDTO.getAuthUserId())) {
            throw new ResourceAlreadyExistException(HttpStatus.CONFLICT, String.format(
                    "Staff [%s %s] already exist in the system", staffDTO.getFirstName(), staffDTO.getLastName()));
        }

        Staff staff = Staff.builder()
                .authUserId(staffDTO.getAuthUserId())
                .firstName(staffDTO.getFirstName())
                .lastName(staffDTO.getLastName())
                .email(staffDTO.getEmail())
                .staffRole(staffDTO.getRole())
                .phone(staffDTO.getPhoneNumber())
                .address(staffDTO.getAddress())
                .gender(staffDTO.getGender())
                .staffType(staffDTO.getStaffType())
                .courseSpecialization(staffDTO.getCourseSpecialization())
                .build();

        Staff savedStaff = staffRepository.save(staff);
        return ApiResponse.onSuccess(savedStaff.getStaffId());
    }

    @Override
    public ApiResponse<StaffProfileResponseDTO> getStaffProfile(Authentication authentication) {
        String subject = authentication.getName();

        UUID authUserId = UUID.fromString(subject);
        Staff staff = staffRepository.findByAuthUserIdAndIsDeletedFalse(authUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Your data is not present in the system",
                        HttpStatus.NOT_FOUND));

        return ApiResponse.onSuccess(StaffProfileResponseDTO.builder()
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .phoneNumber(staff.getPhone())
                .address(staff.getAddress())
                .staffId(staff.getStaffId())
                .staffType(staff.getStaffType().name())
                .gender(staff.getGender().name())
                .courseSpecialization(staff.getCourseSpecialization())
                .build());
    }

    @Override
    public ApiResponse<List<StaffDTO>> getAllStaff() {
        return ApiResponse.onSuccess(staffRepository.findAllByIsDeletedFalse()
                .stream()
                .map(this::mapToDTO)
                .toList());
    }

    @Override
    public ApiResponse<String> updateStaff(StaffDTO staffDTO) {
        UUID authUserId = staffDTO.getAuthUserId();
        Staff staff = staffRepository.findByAuthUserIdAndIsDeletedFalse(authUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffDTO.getAuthUserId(),
                        HttpStatus.NOT_FOUND));

        // Only update fields that are not null
        if (staffDTO.getFirstName() != null)
            staff.setFirstName(staffDTO.getFirstName());
        if (staffDTO.getLastName() != null)
            staff.setLastName(staffDTO.getLastName());
        if (staffDTO.getEmail() != null)
            staff.setEmail(staffDTO.getEmail());
        if (staffDTO.getPhoneNumber() != null)
            staff.setPhone(staffDTO.getPhoneNumber());
        if (staffDTO.getAddress() != null)
            staff.setAddress(staffDTO.getAddress());
        if (staffDTO.getStaffType() != null)
            staff.setStaffType(staffDTO.getStaffType());
        if (staffDTO.getRole() != null)
            staff.setStaffRole(staffDTO.getRole());
        if (staffDTO.getCourseSpecialization() != null)
            staff.setCourseSpecialization(staffDTO.getCourseSpecialization());

        staffRepository.save(staff);
        return ApiResponse.onSuccess("Staff updated successfully");
    }

    @Override
    public ApiResponse<String> deleteStaffSelf(Authentication authentication) {
        UUID authUserId = UUID.fromString(authentication.getName());
        Optional<Staff> staffOpt = staffRepository.findByAuthUserIdAndIsDeletedFalse(authUserId);

        if (staffOpt.isEmpty()) return ApiResponse.onSuccess("Staff already deleted");

        Staff staff = staffOpt.get();
        staff.setDeleted(true);
        return ApiResponse.onSuccess("Staff deleted successfully");
    }

    @Override
    public ApiResponse<String> deleteByAdmin(UUID staffId) {
        Optional<Staff> staffOpt = staffRepository.findByStaffIdAndIsDeletedFalse(staffId);

        if (staffOpt.isEmpty()) return ApiResponse.onSuccess("Staff already deleted");

        Staff staff = staffOpt.get();
        staff.setDeleted(true);
        return ApiResponse.onSuccess("Staff deleted successfully");
    }

    private StaffDTO mapToDTO(Staff staff) {
        return StaffDTO.builder()
                .staffId(staff.getStaffId())
                .authUserId(staff.getAuthUserId())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .email(staff.getEmail())
                .phoneNumber(staff.getPhone())
                .address(staff.getAddress())
                .staffType(staff.getStaffType())
                .gender(staff.getGender())
                .role(staff.getStaffRole())
                .courseSpecialization(staff.getCourseSpecialization())
                .build();
    }

    @Override
    public ApiResponse<List<EligibleStaffResponseDTO>> getEligibleStaff(List<String> courseSpecialization,
                                                                        boolean multiple) {
        List<String> filters = new ArrayList<>(courseSpecialization);
        if (multiple) {
            filters.add("multiple");
        }
        return ApiResponse.onSuccess(
                staffRepository.findByCourseSpecializationIn(filters)
                        .stream()
                        .map(
                                staff -> EligibleStaffResponseDTO.builder()
                                        .staffId(staff.getStaffId())
                                        .name(staff.getFirstName() + " " + staff.getLastName())
                                        .courseSpecialization(staff.getCourseSpecialization())
                                        .build())
                        .toList());
    }

    @Override
    public ApiResponse<UUID> getStaffId(Authentication authentication) {
        UUID authUserId = UUID.fromString(authentication.getName());
        Optional<Staff> staffOpt = staffRepository.findByAuthUserIdAndIsDeletedFalse(authUserId);
        return staffOpt.map(staff -> ApiResponse.onSuccess(staff.getStaffId())).orElseGet(() -> ApiResponse.onSuccess(null));
    }
}