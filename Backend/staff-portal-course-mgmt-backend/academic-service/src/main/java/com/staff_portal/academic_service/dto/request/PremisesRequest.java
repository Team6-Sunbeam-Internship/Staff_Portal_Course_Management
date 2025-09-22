package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.PremisesStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PremisesRequest {

	@NotBlank
	private String name;

	private String type;

	@NotBlank
	private String address;

	@NotBlank
	private String city;

	@NotBlank
	private String state;

	@NotBlank
	private String postalCode;

	@NotNull
	private PremisesStatus status;

}
