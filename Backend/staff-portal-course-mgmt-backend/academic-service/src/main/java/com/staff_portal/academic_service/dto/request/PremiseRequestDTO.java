package com.staff_portal.academic_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PremiseRequestDTO {
    @NotBlank
    private String title;

    private String type;

    @NotBlank
    private String address;

    private String description;
}
