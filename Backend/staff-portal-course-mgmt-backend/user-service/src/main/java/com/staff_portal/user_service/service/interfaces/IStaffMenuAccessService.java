package com.staff_portal.user_service.service.interfaces;

import java.util.List;
import java.util.UUID;

import com.staff_portal.user_service.dto.request.StaffMenuAccessDTO;

public interface IStaffMenuAccessService {

	StaffMenuAccessDTO createAccess(StaffMenuAccessDTO request);
	List<StaffMenuAccessDTO> getAllAccess();
	List<StaffMenuAccessDTO> getAccessByStaffId(UUID staffId);
    StaffMenuAccessDTO updateStatus(UUID id, String status);
    String deleteAccess(UUID id);
    List<StaffMenuAccessDTO> searchByStaffName(String name);

}