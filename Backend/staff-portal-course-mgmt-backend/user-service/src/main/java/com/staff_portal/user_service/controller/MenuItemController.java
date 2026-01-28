package com.staff_portal.user_service.controller;

import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.dto.response.MenuItemResponseDTO;
import com.staff_portal.user_service.dto.response.SidebarMenuItemDTO;
import com.staff_portal.user_service.model.MenuItem;
import com.staff_portal.user_service.service.interfaces.IMenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/menu-items")
@CrossOrigin
public class MenuItemController {

    @Autowired
    IMenuItemService menuItemService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UUID>> createMenuItem(@RequestBody MenuItem request) {
        return ResponseEntity.ok(menuItemService.createMenuItem(request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<String>> updateMenuItem(@PathVariable UUID id, @RequestBody MenuItem request) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable UUID id) {
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<MenuItemResponseDTO>>> getAllMenuItem() {
        return ResponseEntity.ok(menuItemService.getAllMenuItem());
    }

    @GetMapping("/getSidebarMenuItems")
    public ResponseEntity<ApiResponse<List<SidebarMenuItemDTO>>> getSidebarMenuItems(Authentication authentication) {
        return ResponseEntity.ok(menuItemService.getMenuItemForSidebar(authentication));
    }

}
