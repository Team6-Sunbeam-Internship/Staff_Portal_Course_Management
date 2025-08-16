package com.staff_portal.user_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.user_service.dto.request.StaffMenuAccessDTO;
import com.staff_portal.user_service.enums.AccessStatus;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.model.MenuItem;
import com.staff_portal.user_service.model.StaffMenuAccess;
import com.staff_portal.user_service.repository.MenuItemRepository;
import com.staff_portal.user_service.repository.StaffMenuAccessRepository;
import com.staff_portal.user_service.service.interfaces.IStaffMenuAccessService;

@Service
public class StaffMenuAccessServiceImpl implements IStaffMenuAccessService {

	@Autowired
	MenuItemRepository menuItemRepository;
	
	@Autowired
	StaffMenuAccessRepository staffMenuAccessRepository;
	
	@Override
	public StaffMenuAccessDTO createAccess(StaffMenuAccessDTO request) {
		MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        StaffMenuAccess access = StaffMenuAccess.builder()
                .staffId(request.getStaffId())
                .menuItem(menuItem)
                .status(request.getStatus())
                .build();

        StaffMenuAccess saved = staffMenuAccessRepository.save(access);

        return StaffMenuAccessDTO.builder()
                .staffId(saved.getStaffId())
                .menuItemId(saved.getMenuItem().getMenuItemId())
                .status(saved.getStatus())
                .build();

	}

	@Override
	public List<StaffMenuAccessDTO> getAllAccess() {
		List<StaffMenuAccess> accessList = staffMenuAccessRepository.findAll();
        return accessList.stream()
                .map(item -> StaffMenuAccessDTO.builder()
                        .staffId(item.getStaffId())
                        .menuItemId(item.getMenuItem().getMenuItemId())
                        .status(item.getStatus())
                        .build())
                .collect(Collectors.toList());
	}

	@Override
	public List<StaffMenuAccessDTO> getAccessByStaffId(String staffId) {
		 List<StaffMenuAccess> accessList = staffMenuAccessRepository.findByStaffId(staffId);
	     if (accessList.isEmpty()) {
	          throw new ResourceNotFoundException("No access records found for staff ID: " + staffId);
	     }
	     return accessList.stream()
	            .map(item -> StaffMenuAccessDTO.builder()
	                   .staffId(item.getStaffId())
	                   .menuItemId(item.getMenuItem().getMenuItemId())
	                   .status(item.getStatus())
	                   .build())
	                   .collect(Collectors.toList());
	}

	@Override
	public StaffMenuAccessDTO updateStatus(Long id, String newStatus) {
		StaffMenuAccess access = staffMenuAccessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Access record not found with ID: " + id));

        access.setStatus(AccessStatus.valueOf(newStatus.toUpperCase()));
        StaffMenuAccess updated =staffMenuAccessRepository.save(access);

        return StaffMenuAccessDTO.builder()
                .staffId(updated.getStaffId())
                .menuItemId(updated.getMenuItem().getMenuItemId())
                .status(updated.getStatus())
                .build();
	}

	@Override
	public String deleteAccess(Long id) {
		if (!staffMenuAccessRepository.existsById(id)) {
            throw new ResourceNotFoundException("Access record not found with ID: " + id);
        }
		staffMenuAccessRepository.deleteById(id);
        
		return "Menu item deleted successfully with ID: " + id;		
	}

}
