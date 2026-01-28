package com.staff_portal.user_service.service.implementation;

import com.staff_portal.user_service.dto.request.RoleMenuAccessDTO;
import com.staff_portal.user_service.dto.request.RoleMenuAccessUpdateReqDTO;
import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.dto.response.RoleMenuAccessUpdateStatusResponseDTO;
import com.staff_portal.user_service.enums.AccessStatus;
import com.staff_portal.user_service.enums.StaffRole;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.model.MenuItem;
import com.staff_portal.user_service.model.RoleMenuAccess;
import com.staff_portal.user_service.repository.MenuItemRepository;
import com.staff_portal.user_service.repository.RoleMenuAccessRepository;
import com.staff_portal.user_service.service.interfaces.IRoleMenuAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.*;

@Service
@Transactional
public class RoleMenuAccessServiceImpl implements IRoleMenuAccessService {

    @Autowired
    MenuItemRepository menuItemRepository;

    @Autowired
    RoleMenuAccessRepository roleMenuAccessRepository;

    @Override
    public ApiResponse<RoleMenuAccessUpdateStatusResponseDTO> updateRoleMenuAccessStatus(RoleMenuAccessUpdateReqDTO updateReq) {

        RoleMenuAccess roleMenuAccess = roleMenuAccessRepository.findById(updateReq.id())
                .orElseThrow(() -> new ResourceNotFoundException("RoleMenuAccess not found with ID : " + updateReq.id(), HttpStatus.NOT_FOUND));
        AccessStatus oldStatus = roleMenuAccess.getStatus();
        roleMenuAccess.setStatus(updateReq.status());

        MenuItem menuItem = roleMenuAccess.getMenuItem();
        boolean isParent = menuItem.getParentKey() == null && menuItem.getPath() == null;
        StaffRole role = roleMenuAccess.getRole();

        List<UUID> updateAccessIds = new ArrayList<>();
        updateAccessIds.add(roleMenuAccess.getAccessId());
        if (isParent) {
            String pathKey = menuItem.getFullPathKey();
            // Find the descendants/children of the parentKey
            List<MenuItem> descendants = menuItemRepository.findAllDescendantsByFullPathKey(pathKey);
            for (MenuItem descendant : descendants) {
                roleMenuAccessRepository.findByRoleAndMenuItem(role, descendant).ifPresent(childAccess -> {
                    childAccess.setStatus(updateReq.status());
                    updateAccessIds.add(childAccess.getAccessId());
                });
            }
        }
        // Child BLOCKED -> ALLOWED and parent currently BLOCKED
        else if (updateReq.status() == AccessStatus.ALLOWED) {
            String childParentKey = menuItem.getParentKey();  // Parent fullPathKey
            MenuItem parentMenuItem = menuItemRepository.findByFullPathKey(childParentKey)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent menu item not found key: " + childParentKey, HttpStatus.NOT_FOUND));
            roleMenuAccessRepository
                    .findByRoleAndMenuItem(role, parentMenuItem)
                    .filter(parentAccess -> parentAccess.getStatus() == AccessStatus.BLOCKED)
                    .ifPresent(parentAccess -> {
                        parentAccess.setStatus(AccessStatus.ALLOWED);
                        updateAccessIds.add(parentAccess.getAccessId());
                    });
        }

        return ApiResponse.onSuccess(
                RoleMenuAccessUpdateStatusResponseDTO.builder()
                        .message("RoleMenuAccess updated successfully")
                        .updateAccessIds(updateAccessIds)
                        .build()
        );
    }

    @Override
    public ApiResponse<List<RoleMenuAccessDTO>> getAllRoleMenuAccessData() {
        List<RoleMenuAccess> roleMenuAccessData = roleMenuAccessRepository.findAll();

        if (roleMenuAccessData.isEmpty()) {
            throw new ResourceNotFoundException("No Role Menu Access data found", HttpStatus.NOT_FOUND);
        }

        return ApiResponse.onSuccess(roleMenuAccessData.stream()
                .map(this::mapToDTO)
                .toList());
    }

//    @Override
//    public List<RoleMenuAccessDTO> getAccessByRole(String roleName) {
//        List<RoleMenuAccess> roleMenuAccessData = Optional
//                .of(roleMenuAccessRepository.findByRole(roleName))
//                .filter(list -> !list.isEmpty())
//                .orElseThrow(() -> new ResourceNotFoundException(
//                        "No menu access found for role: " + roleName, HttpStatus.NOT_FOUND));
//
//        return roleMenuAccessData.stream()
//                .map(this::mapToDTO)
//                .toList();
//    }

    // Private helper method
    private RoleMenuAccessDTO mapToDTO(RoleMenuAccess entity) {
        return RoleMenuAccessDTO.builder()
                .id(entity.getAccessId())
                .roleName(entity.getRole().name())
                .menuItemId(entity.getMenuItem().getId())
                .title(entity.getMenuItem().getPath() == null && entity.getMenuItem().getParentKey() == null
                        ? entity.getMenuItem().getTitle() + " (Parent)"
                        : entity.getMenuItem().getTitle())
                .status(entity.getStatus())
                .parent(entity.getMenuItem().getParentKey() == null)
                .build();
    }
}
