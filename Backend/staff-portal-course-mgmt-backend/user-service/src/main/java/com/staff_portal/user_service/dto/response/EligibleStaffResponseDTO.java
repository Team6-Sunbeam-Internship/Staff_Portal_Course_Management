package com.staff_portal.user_service.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class EligibleStaffResponseDTO {
    private UUID staffId;
    private String name;
    private String courseSpecialization;
}
