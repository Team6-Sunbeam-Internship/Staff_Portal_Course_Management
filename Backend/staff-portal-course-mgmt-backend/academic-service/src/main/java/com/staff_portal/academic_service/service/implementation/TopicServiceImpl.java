package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.TopicRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.exception.ResourseAlreadyExistException;
import com.staff_portal.academic_service.model.Section;
import com.staff_portal.academic_service.model.Topic;
import com.staff_portal.academic_service.repository.SectionRepository;
import com.staff_portal.academic_service.repository.TopicRepository;
import com.staff_portal.academic_service.service.interfaces.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final SectionRepository sectionRepository;

    @Override
    public ApiResponse<UUID> createTopic(UUID sectionId, TopicRequestDTO requestDTO) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("No section found with id %s", sectionId)));

        if (topicRepository.existsByTopicCode(requestDTO.getTopicCode())) {
            throw new ResourseAlreadyExistException(String.format("Topic already exists with code: %s", requestDTO.getTopicCode()), HttpStatus.BAD_REQUEST);
        }

        Topic topic = Topic.builder()
                .topicCode(requestDTO.getTopicCode())
                .topicName(requestDTO.getTopicName())
                .section(section)
                .build();
        Topic savedTopic = topicRepository.save(topic);

        return ApiResponse.onSuccess(savedTopic.getTopicId());
    }

    @Override
    public ApiResponse<String> updateTopic(UUID topicId, TopicRequestDTO requestDTO) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("No topic found with id %s", topicId)));

        topic.setTopicCode(requestDTO.getTopicCode());
        topic.setTopicName(requestDTO.getTopicName());

        return ApiResponse.onSuccess(String.format("Updated topic with code: %s", topic.getTopicCode()));
    }

    @Override
    @Transactional
    public void deleteTopic(UUID topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("No topic found with id %s", topicId)));

        // Soft delete
        topic.setDeleted(true);
    }
}
