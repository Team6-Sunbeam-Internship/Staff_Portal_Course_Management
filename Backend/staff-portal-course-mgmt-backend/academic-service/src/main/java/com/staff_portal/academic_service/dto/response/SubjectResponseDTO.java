package com.staff_portal.academic_service.dto.response;


import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubjectResponseDTO {
    private UUID id;
    private UUID moduleId;
    private String title;
    private int theoryHours;
    private int practicalHours;
}
