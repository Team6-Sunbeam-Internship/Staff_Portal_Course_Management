package com.staff_portal.academic_service.service.interfaces;

import com.staff_portal.academic_service.dto.request.TopicRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;

import java.util.UUID;

public interface TopicService {
    ApiResponse<UUID> createTopic(UUID sectionId, TopicRequestDTO requestDTO);

    ApiResponse<String> updateTopic(UUID topicId , TopicRequestDTO requestDTO);

    void deleteTopic(UUID topicId);
}
