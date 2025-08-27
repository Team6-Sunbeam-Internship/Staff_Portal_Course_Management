package com.staff_portal.user_service.service.implementation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.user_service.dto.request.RoleMenuAccessDTO;
import com.staff_portal.user_service.enums.AccessStatus;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.model.MenuItem;
import com.staff_portal.user_service.model.RoleMenuAccess;
import com.staff_portal.user_service.repository.MenuItemRepository;
import com.staff_portal.user_service.repository.RoleMenuAccessRepository;
import com.staff_portal.user_service.service.interfaces.IRoleMenuAccessService;

@Service
public class RoleMenuAccessServiceImpl implements IRoleMenuAccessService {

	@Autowired
	MenuItemRepository menuItemRepository;
	
	@Autowired
	RoleMenuAccessRepository roleMenuAccessRepository;
	
	@Override
	public RoleMenuAccessDTO createRoleMenuAccess(RoleMenuAccessDTO request) {
		
		MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem not found with ID : " +request.getMenuItemId()));
		
		RoleMenuAccess roleMenuAccess = RoleMenuAccess.builder()
				.roleName(request.getRoleName())
				.menuItem(menuItem)
				.status(request.getStatus())
				.build();
		
		RoleMenuAccess saved = roleMenuAccessRepository.save(roleMenuAccess);
		
		 return mapToDTO(saved);
	}

	@Override
	public RoleMenuAccessDTO updateRoleMenuAccessStatus(Long accessId, String newStatus) {
		
		RoleMenuAccess roleMenuAccess = roleMenuAccessRepository.findById(accessId)
				.orElseThrow(()-> new ResourceNotFoundException("RoleMenuAccess not found with ID : " + accessId ));
		
		roleMenuAccess.setStatus(AccessStatus.valueOf(newStatus.toUpperCase()));
		RoleMenuAccess updated = roleMenuAccessRepository.save(roleMenuAccess);
		
		return mapToDTO(updated);
		
	}
	
	 @Override
	    public String deleteRoleMenuAccess(Long accessId) {
	        if (!roleMenuAccessRepository.existsById(accessId)) {
	            throw new ResourceNotFoundException("RoleMenuAccess not found with ID : " + accessId );
	        }	        
	        roleMenuAccessRepository.deleteById(accessId);
	        return "Menu item deleted successfully with ID: " + accessId;
	    }

	 @Override
	 public List<RoleMenuAccessDTO> getAllRoleMenuAccessData() {
		List<RoleMenuAccess> roleMenuAccessData = roleMenuAccessRepository.findAll();
		
		if(roleMenuAccessData.isEmpty())
		{
			throw new ResourceNotFoundException("No Role Menu Access data found");
		}
		
		return roleMenuAccessData.stream()
		 .map(this::mapToDTO)
		 .toList();
	 }

	    @Override
	    public List<RoleMenuAccessDTO> getAccessByRole(String roleName) {
	        List<RoleMenuAccess> roleMenuAccessData = Optional
	                .of(roleMenuAccessRepository.findByRoleNameIgnoreCase(roleName))
	                .filter(list -> !list.isEmpty())
	                .orElseThrow(() -> new ResourceNotFoundException(
	                        "No menu access found for role: " + roleName));

	        return roleMenuAccessData.stream()
	                .map(this::mapToDTO)
	                .toList();
	    }

	 // Private helper method
	 private RoleMenuAccessDTO mapToDTO(RoleMenuAccess entity) {
		    return RoleMenuAccessDTO.builder()
		            .accessId(entity.getAccessId())
		            .roleName(entity.getRoleName())
		            .menuItemId(entity.getMenuItem().getMenuItemId()) 
		            .status(entity.getStatus())
		            .build();
		}



	 
}
