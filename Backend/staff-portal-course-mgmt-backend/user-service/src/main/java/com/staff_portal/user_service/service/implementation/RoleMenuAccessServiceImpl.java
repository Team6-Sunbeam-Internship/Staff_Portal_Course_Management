package com.staff_portal.user_service.service.implementation;

import java.util.List;
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
		
		return RoleMenuAccessDTO.builder()
				.accessId(saved.getAccessId())
				.roleName(saved.getRoleName())
				.menuItemId(saved.getMenuItem().getMenuItemId())
				.status(saved.getStatus())
				.build();
	}

	@Override
	public RoleMenuAccessDTO updateRoleMenuAccessStatus(Long accessId, String newStatus) {
		
		RoleMenuAccess roleMenuAccess = roleMenuAccessRepository.findById(accessId)
				.orElseThrow(()-> new ResourceNotFoundException("RoleMenuAccess not found with ID : " + accessId ));
		
		roleMenuAccess.setStatus(AccessStatus.valueOf(newStatus.toUpperCase()));
		RoleMenuAccess updated = roleMenuAccessRepository.save(roleMenuAccess);
		
		return RoleMenuAccessDTO.builder()
				.accessId(accessId)
				.roleName(updated.getRoleName())
				.menuItemId(accessId)
				.status(updated.getStatus())
				.build();
		
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
				.map(item -> RoleMenuAccessDTO.builder()
						.accessId(item.getAccessId())
						.roleName(item.getRoleName())
						.menuItemId(item.getMenuItem().getMenuItemId())
						.status(item.getStatus())
						.build()
						)
				.collect(Collectors.toList());
	 }
}
