package com.staff_portal.academic_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicSimpleDTO {
    private UUID id;
    private String name;
}
