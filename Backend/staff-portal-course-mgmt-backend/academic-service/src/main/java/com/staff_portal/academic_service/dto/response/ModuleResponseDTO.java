package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.enums.ModuleStatus;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
public class ModuleResponseDTO {
    private UUID id;
    private String title;
    private int theoryHours;
    private int practicalHours;
}