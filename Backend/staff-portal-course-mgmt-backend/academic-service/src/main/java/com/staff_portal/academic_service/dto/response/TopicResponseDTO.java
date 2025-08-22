package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.enums.TopicStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopicResponseDTO {
    private Integer topicId;
    private String topicName;
    private TopicStatus status;

    // hierarchy info
    private String sectionName;
    private String subjectName;
    private String moduleName;
    private String courseName;
}
