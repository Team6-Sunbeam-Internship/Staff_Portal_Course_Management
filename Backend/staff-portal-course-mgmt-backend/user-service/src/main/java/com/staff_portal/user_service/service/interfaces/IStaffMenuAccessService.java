package com.staff_portal.user_service.service.interfaces;

import java.util.List;

import com.staff_portal.user_service.dto.request.StaffMenuAccessDTO;
import com.staff_portal.user_service.enums.AccessStatus;

public interface IStaffMenuAccessService {

	StaffMenuAccessDTO createAccess(StaffMenuAccessDTO request);
	List<StaffMenuAccessDTO> getAllAccess();
    List<StaffMenuAccessDTO> getAccessByStaffId(String staffId);
    StaffMenuAccessDTO updateStatus(Long id, String status);
    String deleteAccess(Long id);

}
