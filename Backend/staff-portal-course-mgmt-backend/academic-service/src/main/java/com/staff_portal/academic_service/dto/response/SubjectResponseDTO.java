package com.staff_portal.academic_service.dto.response;


import com.staff_portal.academic_service.enums.SubjectStatus;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
public class SubjectResponseDTO {
    private UUID id;
    private UUID moduleId;
    private String title;
    private int theoryHours;
    private int practicalHours;
}
