package com.staff_portal.user_service.dto.request;

import com.staff_portal.user_service.enums.AccessStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RoleMenuAccessDTO {
	
	private Long accessId;
	private String roleName;
    private Long menuItemId;
    private AccessStatus status;
}
