package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.TopicStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class TopicRequestDTO {
    private String topicCode;
    private String topicName;
}
