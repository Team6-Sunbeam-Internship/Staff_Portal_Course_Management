package com.staff_portal.user_service.dto.request;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.staff_portal.user_service.enums.AccessStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StaffMenuAccessDTO {
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	private UUID staffAccessId;
	private UUID staffId;
	private String staffFirstName;
	private String staffLastName;
	private Long menuItemId;
	private String menuItemTitle;
	private AccessStatus status;
}