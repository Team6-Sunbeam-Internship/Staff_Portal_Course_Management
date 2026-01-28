package com.staff_portal.user_service.service.interfaces;

import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.dto.response.MenuItemResponseDTO;
import com.staff_portal.user_service.dto.response.SidebarMenuItemDTO;
import com.staff_portal.user_service.model.MenuItem;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

public interface IMenuItemService {

    ApiResponse<UUID> createMenuItem(MenuItem request);

    ApiResponse<String> updateMenuItem(UUID id, MenuItem request);

    void deleteMenuItem(UUID id);

    ApiResponse<List<MenuItemResponseDTO>> getAllMenuItem();

    ApiResponse<List<SidebarMenuItemDTO>> getMenuItemForSidebar(Authentication authentication);
}
