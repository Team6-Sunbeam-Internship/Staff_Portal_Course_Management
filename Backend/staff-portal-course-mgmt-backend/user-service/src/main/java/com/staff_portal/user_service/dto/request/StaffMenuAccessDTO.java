package com.staff_portal.user_service.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.staff_portal.user_service.enums.AccessStatus;
import com.staff_portal.user_service.enums.StaffRole;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class StaffMenuAccessDTO {
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private UUID id;
	private UUID staffId;
	private String staffFirstName;
	private String staffLastName;
    private StaffRole staffRoleName;
	private UUID menuItemId;
	private String menuItemTitle;
	private AccessStatus status;
}