package com.staff_portal.academic_service.dto.response;


import com.staff_portal.academic_service.enums.SectionStatus;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
public class SectionResponseDTO {
    private UUID id;
    private UUID subjectId;
    private String title;
}
