package com.staff_portal.user_service.dto.response;

import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record RoleMenuAccessUpdateStatusResponseDTO(String message, List<UUID> updateAccessIds) {
}
