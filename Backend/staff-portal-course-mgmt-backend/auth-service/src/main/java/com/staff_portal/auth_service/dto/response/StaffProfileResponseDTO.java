package com.staff_portal.auth_service.dto.response;

import lombok.Builder;

@Builder
public record StaffProfileResponseDTO(String firstName, String lastName, String phoneNumber, String address, String staffType) { }
