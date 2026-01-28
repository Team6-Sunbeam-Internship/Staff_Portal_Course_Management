package com.staff_portal.user_service.service.implementation;

import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.dto.response.MenuItemResponseDTO;
import com.staff_portal.user_service.dto.response.SidebarMenuItemDTO;
import com.staff_portal.user_service.enums.AccessStatus;
import com.staff_portal.user_service.enums.StaffRole;
import com.staff_portal.user_service.exception.DuplicateResourceException;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.model.MenuItem;
import com.staff_portal.user_service.repository.MenuItemRepository;
import com.staff_portal.user_service.repository.RoleMenuAccessRepository;
import com.staff_portal.user_service.repository.StaffMenuAccessRepository;
import com.staff_portal.user_service.service.interfaces.IMenuItemService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class MenuItemServiceImpl implements IMenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final RoleMenuAccessRepository roleMenuAccessRepository;
    private final StaffMenuAccessRepository staffMenuAccessRepository;

    public MenuItemServiceImpl(MenuItemRepository menuItemRepository, RoleMenuAccessRepository roleMenuAccessRepository, StaffMenuAccessRepository staffMenuAccessRepository) {
        this.menuItemRepository = menuItemRepository;
        this.roleMenuAccessRepository = roleMenuAccessRepository;
        this.staffMenuAccessRepository = staffMenuAccessRepository;
    }

    @Override
    public ApiResponse<UUID> createMenuItem(MenuItem request) {
        if (menuItemRepository.existsByTitle(request.getTitle())) {
            throw new DuplicateResourceException(HttpStatus.BAD_REQUEST, "Menu Item with title '" + request.getTitle() + "' already exists");
        }

        MenuItem menuItem = MenuItem.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .path(request.getPath())
                .build();

        MenuItem saved = menuItemRepository.save(menuItem);

        return ApiResponse.onSuccess(saved.getId());
    }

    @Override
    public ApiResponse<String> updateMenuItem(UUID id, MenuItem request) {

        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with ID : " + id, HttpStatus.NOT_FOUND));

        menuItem.setTitle(request.getTitle());
        menuItem.setDescription(request.getDescription());
        menuItem.setPath(request.getPath());

        menuItemRepository.save(menuItem);

        return ApiResponse.onSuccess(String.format("Menu item with ID '%s' has been updated", id));
    }

    @Override
    public void deleteMenuItem(UUID id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("MenuItem not found with ID : " + id, HttpStatus.NOT_FOUND);
        }

        menuItemRepository.deleteById(id);
    }

    @Override
    public ApiResponse<List<MenuItemResponseDTO>> getAllMenuItem() {
        List<MenuItem> menuItems = menuItemRepository.findAll();

        if (menuItems.isEmpty()) {
            throw new ResourceNotFoundException("No menu items found", HttpStatus.LENGTH_REQUIRED);
        }

        return ApiResponse.onSuccess(menuItems.stream()
                .map(menuItem -> MenuItemResponseDTO.builder()
                        .id(menuItem.getId())
                        .title(menuItem.getTitle())
                        .description(menuItem.getDescription())
                        .path(menuItem.getPath())
                        .parentKey(menuItem.getParentKey())
                        .fullPathKey(menuItem.getFullPathKey())
                        .build()
                )
                .toList());
    }

    public ApiResponse<List<SidebarMenuItemDTO>> getMenuItemForSidebar(Authentication authentication) {
        String sub = authentication.getName();
        UUID staffId = UUID.fromString(sub);

        JwtAuthenticationToken authToken = (JwtAuthenticationToken) authentication;

        String role = authToken.getToken()
                .getClaimAsStringList("roles")
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No role present"));
        List<MenuItem> allMenuItems = menuItemRepository.findAll();

        log.debug("""
                All Menu Items:
                {}
                """,allMenuItems);

        Map<String, String> finalAccessStatus = getFinalAccessStatus(staffId, StaffRole.valueOf(role));

        List<MenuItem> allowedMenuItems = allMenuItems
                .stream()
                .filter(item -> AccessStatus.ALLOWED.name().equals(finalAccessStatus.get(item.getFullPathKey())))
                .toList();
        log.debug("""
                allowedMenuItems:
                {}
                """,allMenuItems);
        return buildMenuHierarchy(allowedMenuItems);
    }


    private Map<String, String> getFinalAccessStatus(UUID staffId, StaffRole staffRole) {
        Map<String, String> roleAccess = roleMenuAccessRepository.findByRole(staffRole)
                .stream()
                .collect(Collectors.toMap(
                        access -> access.getMenuItem().getFullPathKey(),
                        access -> access.getStatus().name()
                ));
        Map<String, String> staffOverrides = staffMenuAccessRepository.findStaffAccessByStaffId(staffId)
                .stream()
                .collect(Collectors.toMap(
                        access -> access.getMenuItem().getFullPathKey(),
                        access -> access.getStatus().name()
                ));
        Map<String, String> finalStatus = new HashMap<>();
        finalStatus.putAll(roleAccess);
        finalStatus.putAll(staffOverrides);
        return finalStatus;
    }


    private ApiResponse<List<SidebarMenuItemDTO>> buildMenuHierarchy(List<MenuItem> allowedMenuItems) {
        Map<String, List<MenuItem>> itemsByParent = allowedMenuItems
                .stream()
                .collect(Collectors.groupingBy(item -> item.getParentKey() != null ? item.getParentKey() : "ROOT"));

        List<MenuItem> rootItems = itemsByParent.getOrDefault("ROOT", List.of());
        ApiResponse<List<SidebarMenuItemDTO>> listApiResponse = ApiResponse.onSuccess(rootItems
                .stream()
                .map(rootItem -> mapToDto(rootItem, itemsByParent))
//                .sorted(Comparator.comparing(SidebarMenuItemDTO::getLabel))
                .toList());
        log.debug("""
                listApiResponse:
                {}
                """,listApiResponse);
        return listApiResponse;
    }

    private SidebarMenuItemDTO mapToDto(MenuItem rootItem, Map<String, List<MenuItem>> itemsByParent) {
        String currentKey = rootItem.getFullPathKey();

        List<MenuItem> childrenEntities = itemsByParent.getOrDefault(currentKey, List.of());

        List<SidebarMenuItemDTO> childrenDTOs = childrenEntities.stream()
                .map(child -> mapToDto(child, itemsByParent))
//                .sorted(Comparator.comparing(SidebarMenuItemDTO::getLabel))
                .toList();

        String icon = switch (currentKey) {
            case "dashboard" -> "Home";
            case "academic-management" -> "BookOpen";
            case "infrastructure-management" -> "Server";
            case "staff-management" -> "Users";
            case "student-operations" -> "GraduationCap";
            case "scheduling-management" -> "CalendarDays";
            case "session-management" -> "MonitorPlay";
            case "system-administration" -> "Settings";
            case "timesheet-management" -> "NotebookTabs";
            default -> null;
        };

        SidebarMenuItemDTO dto = SidebarMenuItemDTO.builder()
                .key(currentKey)
                .label(rootItem.getTitle())
                .icon(icon)
                .build();

        if (childrenDTOs.isEmpty()) {
            dto.setPath(rootItem.getPath());
            dto.setSingle(true);
        } else {
            dto.setChildren(childrenDTOs);
        }

        return dto;
    }
}
