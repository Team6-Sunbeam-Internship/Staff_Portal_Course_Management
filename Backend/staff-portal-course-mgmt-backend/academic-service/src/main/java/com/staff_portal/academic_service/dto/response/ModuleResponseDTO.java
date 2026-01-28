package com.staff_portal.academic_service.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ModuleResponseDTO {
    private UUID id;
    private String title;
    private int theoryHours;
    private int practicalHours;
    private UUID moduleRouterId;
}