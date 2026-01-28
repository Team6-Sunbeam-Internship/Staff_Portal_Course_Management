package com.staff_portal.user_service.service.implementation;

import com.staff_portal.user_service.dto.request.StaffMenuAccessCreateRequestDTO;
import com.staff_portal.user_service.dto.request.StaffMenuAccessDTO;
import com.staff_portal.user_service.dto.response.ApiResponse;
import com.staff_portal.user_service.enums.AccessStatus;
import com.staff_portal.user_service.exception.DuplicateResourceException;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.model.MenuItem;
import com.staff_portal.user_service.model.Staff;
import com.staff_portal.user_service.model.StaffMenuAccess;
import com.staff_portal.user_service.repository.MenuItemRepository;
import com.staff_portal.user_service.repository.StaffMenuAccessRepository;
import com.staff_portal.user_service.repository.StaffRepository;
import com.staff_portal.user_service.service.interfaces.IStaffMenuAccessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
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
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with ID: " + request.getStaffId(), HttpStatus.NOT_FOUND));

//      Fetch menu item
        var menuItem = menuItemRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found", HttpStatus.NOT_FOUND));

        StaffMenuAccess access = StaffMenuAccess.builder()
                .staff(staff)
                .menuItem(menuItem)
                .status(request.getStatus())
                .build();

        StaffMenuAccess saved = staffMenuAccessRepository.save(access);
        return mapToDTO(saved);
    }

    @Override
    public ApiResponse<List<StaffMenuAccessDTO>> getAllAccess() {
        List<StaffMenuAccess> staffMenuAccessExceptionList = staffMenuAccessRepository.findAll();
        return ApiResponse.onSuccess(staffMenuAccessExceptionList
                .stream()
                .map(this::mapToDTO)
                .toList()
        );
    }

    @Override
    public List<StaffMenuAccessDTO> getAccessByStaffId(UUID staffId) {
        List<StaffMenuAccess> accessList = staffMenuAccessRepository.findByStaffStaffId(staffId);
        if (accessList.isEmpty()) {
            throw new ResourceNotFoundException("No access records found for staff ID: " + staffId, HttpStatus.NOT_FOUND);
        }
        return accessList.stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public StaffMenuAccessDTO updateStatus(UUID staffAccessId, String newStatus) {
        StaffMenuAccess access = staffMenuAccessRepository.findById(staffAccessId)
                .orElseThrow(() -> new ResourceNotFoundException("Access record not found with ID: " + staffAccessId, HttpStatus.CREATED));

        access.setStatus(AccessStatus.valueOf(newStatus.toUpperCase()));
        StaffMenuAccess updated = staffMenuAccessRepository.save(access);

        return mapToDTO(updated);
    }

    @Override
    public String deleteAccess(UUID staffAccessId) {
        StaffMenuAccess access = staffMenuAccessRepository.findById(staffAccessId)
                .orElseThrow(() -> new ResourceNotFoundException("Access record not found with ID: " + staffAccessId, HttpStatus.NOT_FOUND));

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
//            if (accessList.isEmpty()) {
//                // Raise an exception so any caller knows it’s “not found”
//                throw new ResourceNotFoundException(
//                        "No staff menu access records found for name: " + name
//                );
//            }
            return accessList.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (ResourceNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to search staff menu access by name", ex);
        }
    }

    @Override
    public ApiResponse<String> createOrUpdateExceptions(StaffMenuAccessCreateRequestDTO request) {
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found for id: " + request.getStaffId(), HttpStatus.NOT_FOUND));

        List<StaffMenuAccessCreateRequestDTO.MenuAccessItem> items = request.getExceptions();

        Set<UUID> menuItemIds = new HashSet<>();
        for (StaffMenuAccessCreateRequestDTO.MenuAccessItem item : items) {
            if (!menuItemIds.add(item.getMenuItemId())) {
                throw new DuplicateResourceException(HttpStatus.BAD_REQUEST, "Duplicate menuItemId in request: " + item.getMenuItemId());
            }
        }

        List<MenuItem> menuItems = menuItemRepository.findAllById(menuItemIds);
        if (menuItems.size() != menuItemIds.size()) {
            Set<UUID> foundIds = menuItems.stream()
                    .map(MenuItem::getId)
                    .collect(Collectors.toSet());
            Set<UUID> missing = new HashSet<>(menuItemIds);
            missing.removeAll(foundIds);

            throw new ResourceNotFoundException(
                    "Some menu items not found: " + missing, HttpStatus.BAD_REQUEST
            );
        }

        Map<UUID, MenuItem> menuItemMap = menuItems.stream()
                .collect(Collectors.toMap(MenuItem::getId, m -> m));

        List<StaffMenuAccess> existingAccesses = staffMenuAccessRepository.findByStaffStaffIdAndMenuItemIdIn(request.getStaffId(), menuItemIds);

        Map<UUID, StaffMenuAccess> existingMap = existingAccesses.stream()
                .collect(Collectors.toMap(acc -> acc.getMenuItem().getId(), acc -> acc));

        List<StaffMenuAccess> toSave = new ArrayList<>();

        for (StaffMenuAccessCreateRequestDTO.MenuAccessItem item : items) {
            UUID menuItemId = item.getMenuItemId();
            AccessStatus status = item.getStatus();

            if (status == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Access Status must not be null for menuItemId: " + menuItemId);
            }

            StaffMenuAccess existing = existingMap.get(menuItemId);
            if (existing != null) {
                existing.setStatus(status);
                toSave.add(existing);
            } else {
                toSave.add(StaffMenuAccess.builder()
                        .staff(staff)
                        .menuItem(menuItemMap.get(menuItemId))
                        .status(status)
                        .build());
            }

            staffMenuAccessRepository.saveAll(toSave);
        }
        return ApiResponse.onSuccess("Staff menu access exceptions saved successfully.");
    }

    //     Private mapper
    private StaffMenuAccessDTO mapToDTO(StaffMenuAccess entity) {
        return StaffMenuAccessDTO.builder()
                .id(entity.getStaffAccessId())
                .staffId(entity.getStaff().getStaffId())
                .staffFirstName(entity.getStaff().getFirstName())
                .staffLastName(entity.getStaff().getLastName())
                .menuItemId(entity.getMenuItem().getId())
                .menuItemTitle(entity.getMenuItem().getTitle())
                .status(entity.getStatus())
                .build();
    }
}
