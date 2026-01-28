package com.staff_portal.user_service.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.UUID;

@Builder
public record StaffProfileResponseDTO(
        @JsonProperty("first_name") String firstName,
        @JsonProperty("last_name") String lastName,
        @JsonProperty("phone_number") String phoneNumber,
        String address,
        UUID staffId,
        String staffType,
        String gender,
        String courseSpecialization
) {
}