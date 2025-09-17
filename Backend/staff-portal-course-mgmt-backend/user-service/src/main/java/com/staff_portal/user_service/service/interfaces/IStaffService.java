package com.staff_portal.user_service.service.interfaces;

import java.util.List;
import java.util.UUID;

import com.staff_portal.user_service.dto.request.StaffDTO;

public interface IStaffService {

	StaffDTO createStaff(StaffDTO staffDTO);
    StaffDTO getStaffById(UUID staffId);
    List<StaffDTO> getAllStaff();
    StaffDTO updateStaff(UUID staffId, StaffDTO staffDTO);
    String deleteStaff(UUID staffId);
    List<StaffDTO> searchStaffByName(String name);
}
