package com.staff_portal.auth_service.dto.request;

import java.util.UUID;

public record AuthUserDeleteReqDTO(UUID authUserId, UUID staffId) {
}
