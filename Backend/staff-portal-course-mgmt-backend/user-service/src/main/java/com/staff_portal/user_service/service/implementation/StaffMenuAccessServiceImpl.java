package com.staff_portal.user_service.service.implementation;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.user_service.dto.request.StaffMenuAccessDTO;
import com.staff_portal.user_service.enums.AccessStatus;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.model.StaffMenuAccess;
import com.staff_portal.user_service.repository.MenuItemRepository;
import com.staff_portal.user_service.repository.StaffMenuAccessRepository;
import com.staff_portal.user_service.repository.StaffRepository;
import com.staff_portal.user_service.service.interfaces.IStaffMenuAccessService;

@Service
public class StaffMenuAccessServiceImpl implements IStaffMenuAccessService {

	@Autowired
	MenuItemRepository menuItemRepository;
	
	@Autowired
	StaffMenuAccessRepository staffMenuAccessRepository;
	
	@Autowired
	StaffRepository staffRepository;
	
	@Override
    public StaffMenuAccessDTO createAccess(StaffMenuAccessDTO request) {
//      Fetch staff
        var staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with ID: " + request.getStaffId()));

//      Fetch menu item
        var menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        StaffMenuAccess access = StaffMenuAccess.builder()
                .staff(staff)
                .menuItem(menuItem)
                .status(request.getStatus())
                .build();

        StaffMenuAccess saved = staffMenuAccessRepository.save(access);
        return mapToDTO(saved);
    }

	@Override
	public List<StaffMenuAccessDTO> getAllAccess() {
		List<StaffMenuAccess> accessList = staffMenuAccessRepository.findAll();
        return accessList.stream()
        		.map(this::mapToDTO)
                .collect(Collectors.toList());
	}
	
    @Override
    public List<StaffMenuAccessDTO> getAccessByStaffId(UUID staffId) {
        List<StaffMenuAccess> accessList = staffMenuAccessRepository.findByStaff_StaffId(staffId);
        if (accessList.isEmpty()) {
            throw new ResourceNotFoundException("No access records found for staff ID: " + staffId);
        }
        return accessList.stream()
                .map(this::mapToDTO)
                .toList();
    }
    
    @Override
    public StaffMenuAccessDTO updateStatus(UUID staffAccessId, String newStatus) {
        StaffMenuAccess access = staffMenuAccessRepository.findById(staffAccessId)
                .orElseThrow(() -> new ResourceNotFoundException("Access record not found with ID: " + staffAccessId));

        access.setStatus(AccessStatus.valueOf(newStatus.toUpperCase()));
        StaffMenuAccess updated = staffMenuAccessRepository.save(access);

        return mapToDTO(updated);	        
    }

    @Override
    public String deleteAccess(UUID staffAccessId) {
        StaffMenuAccess access = staffMenuAccessRepository.findById(staffAccessId)
                .orElseThrow(() -> new ResourceNotFoundException("Access record not found with ID: " + staffAccessId));

        staffMenuAccessRepository.delete(access);
        return "Menu item deleted successfully with ID: " + staffAccessId;		
    }

    @Override
    public List<StaffMenuAccessDTO> searchByStaffName(String name) {
        try {
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("Name cannot be null or empty");
            }
            List<StaffMenuAccess> accessList = staffMenuAccessRepository.searchByStaffName(name.trim());
            if (accessList.isEmpty()) {
                // Raise an exception so any caller knows it’s “not found”
                throw new ResourceNotFoundException(
                    "No staff menu access records found for name: " + name
                );
            }
            return accessList.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException ex) {
            throw ex;
        }
        catch(ResourceNotFoundException ex) {
        	throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to search staff menu access by name", ex);
        }
    }

    
//     Private mapper
    private StaffMenuAccessDTO mapToDTO(StaffMenuAccess entity) {
        return StaffMenuAccessDTO.builder()
                .staffAccessId(entity.getStaffAccessId())   
                .staffId(entity.getStaff().getStaffId())  
                .staffFirstName(entity.getStaff().getFirstName())
                .staffLastName(entity.getStaff().getLastName())
                .menuItemId(entity.getMenuItem().getMenuItemId())
                .menuItemTitle(entity.getMenuItem().getTitle())
                .status(entity.getStatus())
                .build();
    }
}
