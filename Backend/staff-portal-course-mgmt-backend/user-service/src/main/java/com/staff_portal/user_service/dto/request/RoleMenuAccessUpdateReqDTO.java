package com.staff_portal.user_service.dto.request;

import com.staff_portal.user_service.enums.AccessStatus;

import java.util.UUID;

public record RoleMenuAccessUpdateReqDTO(UUID id, AccessStatus status) {
}
