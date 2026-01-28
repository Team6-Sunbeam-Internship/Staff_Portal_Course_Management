package com.staff_portal.academic_service.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SectionResponseDTO {
    private UUID id;
    private UUID subjectId;
    private String title;
}
