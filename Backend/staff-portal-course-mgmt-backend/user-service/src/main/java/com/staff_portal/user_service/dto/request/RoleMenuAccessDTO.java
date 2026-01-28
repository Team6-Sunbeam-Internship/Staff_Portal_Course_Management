package com.staff_portal.user_service.dto.request;

import com.staff_portal.user_service.enums.AccessStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class RoleMenuAccessDTO {
    private UUID id;
    private String roleName;
    private UUID menuItemId;
    private String title;    // Menu Item Title
    private AccessStatus status;
    private boolean parent;
}
