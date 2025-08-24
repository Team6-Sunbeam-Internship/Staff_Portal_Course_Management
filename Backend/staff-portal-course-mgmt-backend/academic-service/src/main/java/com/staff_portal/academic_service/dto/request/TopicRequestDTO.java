package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.TopicStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopicRequestDTO {
    private Integer sectionId;       // dropdown (select section)
    private String topicName;        // title
    private TopicStatus status;      // enum
}
