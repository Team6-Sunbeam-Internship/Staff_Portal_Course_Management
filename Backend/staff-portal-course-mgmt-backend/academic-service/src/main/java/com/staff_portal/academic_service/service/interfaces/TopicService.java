package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.TopicRequestDTO;
import com.staff_portal.academic_service.dto.response.TopicResponseDTO;

public interface TopicService {
    TopicResponseDTO addTopic(TopicRequestDTO requestDTO);
    TopicResponseDTO updateTopic(int id, TopicRequestDTO requestDTO);
    void deleteTopic(int id);
    List<TopicResponseDTO> getAllTopics();
    TopicResponseDTO getTopicById(int id);
    List<TopicResponseDTO> getTopicsByFilters(
            Integer batchCycleId,
            Integer courseTypeId,
            Integer courseId,
            Integer moduleId,
            Integer subjectId,
            Integer sectionId
    );
    List<TopicResponseDTO> getTopicsBySection(int sectionId);
}
