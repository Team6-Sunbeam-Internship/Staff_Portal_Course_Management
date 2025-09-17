package com.staff_portal.user_service.service.implementation;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import com.staff_portal.user_service.dto.request.StaffDTO;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.model.Staff;
import com.staff_portal.user_service.repository.StaffRepository;
import com.staff_portal.user_service.service.interfaces.IStaffService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements IStaffService {

    private final StaffRepository staffRepository;

    @Override
    public StaffDTO createStaff(StaffDTO staffDTO) {
        Staff staff = Staff.builder()
                .authUserId(staffDTO.getAuthUserId())
                .firstName(staffDTO.getFirstName())
                .lastName(staffDTO.getLastName())
                .email(staffDTO.getEmail())
                .phone(staffDTO.getPhone())
                .address(staffDTO.getAddress())
                .designation(staffDTO.getDesignation())
                .staffType(staffDTO.getStaffType())
                .staffRole(staffDTO.getStaffRole())
                .courseSpecialization(staffDTO.getCourseSpecialization())
                .build();

        return mapToDTO(staffRepository.save(staff));
    }

    @Override
    public StaffDTO getStaffById(UUID staffId) {
        Staff staff = staffRepository.findByStaffIdAndIsDeletedFalse(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));
        return mapToDTO(staff);
    }

    @Override
    public List<StaffDTO> getAllStaff() {
        return staffRepository.findAllByIsDeletedFalse()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public StaffDTO updateStaff(UUID staffId, StaffDTO staffDTO) {
        Staff staff = staffRepository.findByStaffIdAndIsDeletedFalse(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + staffId));

        // Only update fields that are not null
        if (staffDTO.getFirstName() != null) staff.setFirstName(staffDTO.getFirstName());
        if (staffDTO.getLastName() != null) staff.setLastName(staffDTO.getLastName());
        if (staffDTO.getEmail() != null) staff.setEmail(staffDTO.getEmail());
        if (staffDTO.getPhone() != null) staff.setPhone(staffDTO.getPhone());
        if (staffDTO.getAddress() != null) staff.setAddress(staffDTO.getAddress());
        if (staffDTO.getDesignation() != null) staff.setDesignation(staffDTO.getDesignation());
        if (staffDTO.getStaffType() != null) staff.setStaffType(staffDTO.getStaffType());
        if (staffDTO.getStaffRole() != null) staff.setStaffRole(staffDTO.getStaffRole());
        if (staffDTO.getCourseSpecialization() != null) staff.setCourseSpecialization(staffDTO.getCourseSpecialization());

        return mapToDTO(staffRepository.save(staff));
    }

    @Override
    public String deleteStaff(UUID id) {
        Staff staff = staffRepository.findByStaffIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));

        staff.setDeleted(true);
        staffRepository.save(staff);

        return "Staff record deleted successfully";
    }
    
//    @Override
//    public List<StaffDTO> searchStaffByName(String name) {
//        try {
//            if (name == null || name.trim().isEmpty()) {
//                throw new IllegalArgumentException("Name cannot be null or empty");
//            }
//            List<Staff> staffList = staffRepository.searchByStaffName(name.trim());
//            if (staffList.isEmpty()) {
//                throw new ResourceNotFoundException(
//                    "No staff found for name: " + name
//                );
//            }
//            return staffList.stream()
//                    .map(this::mapToDTO)
//                    .toList();
//        } catch (IllegalArgumentException ex) {
//            throw ex;
//        } catch (ResourceNotFoundException ex) {
//            throw ex;
//        } catch (Exception ex) {
//            throw new RuntimeException("Failed to search staff by name", ex);
//        }
//    }
    
    @Override
    public List<StaffDTO> searchStaffByName(String name) {
        try {
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("Name cannot be null or empty");
            }
            
            String trimmedName = name.trim();
            // Replace multiple spaces with single space and handle special characters
            String cleanedName = trimmedName.replaceAll("\\s+", " ");
            
            List<Staff> staffList = staffRepository.searchByStaffName(cleanedName);
            return staffList.stream()
                    .map(this::mapToDTO)
                    .toList();
        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            // Log the actual error for debugging
            System.err.println("Error in searchStaffByName: " + ex.getMessage());
            ex.printStackTrace();
            throw new RuntimeException("Failed to search staff by name: " + ex.getMessage(), ex);
        }
    }

    private StaffDTO mapToDTO(Staff staff) {
        return StaffDTO.builder()
                .staffId(staff.getStaffId())
                .authUserId(staff.getAuthUserId())
                .firstName(staff.getFirstName())
                .lastName(staff.getLastName())
                .email(staff.getEmail())
                .phone(staff.getPhone())
                .address(staff.getAddress())
                .designation(staff.getDesignation())
                .staffType(staff.getStaffType())
                .staffRole(staff.getStaffRole())
                .courseSpecialization(staff.getCourseSpecialization())
                .build();
    }
}