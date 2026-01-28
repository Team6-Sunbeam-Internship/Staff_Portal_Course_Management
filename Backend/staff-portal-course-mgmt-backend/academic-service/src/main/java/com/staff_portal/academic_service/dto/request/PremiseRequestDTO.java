package com.staff_portal.academic_service.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    @Valid
    private AddressDTO address;

    private String description;
}
