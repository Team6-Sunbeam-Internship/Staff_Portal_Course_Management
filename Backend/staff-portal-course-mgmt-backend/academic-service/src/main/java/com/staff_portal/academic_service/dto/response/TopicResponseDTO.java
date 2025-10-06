package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.enums.TopicStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponseDTO {
    private UUID id;
    private UUID sectionId;
    private String title;
}
