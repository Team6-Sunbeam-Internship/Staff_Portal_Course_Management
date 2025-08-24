package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.staff_portal.academic_service.dto.request.TopicRequestDTO;
import com.staff_portal.academic_service.dto.response.TopicResponseDTO;
import com.staff_portal.academic_service.enums.TopicStatus;
import com.staff_portal.academic_service.model.Section;
import com.staff_portal.academic_service.model.Topic;
import com.staff_portal.academic_service.repository.SectionRepository;
import com.staff_portal.academic_service.repository.TopicRepository;
import com.staff_portal.academic_service.service.interfaces.TopicService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final SectionRepository sectionRepository;

    @Override
    public TopicResponseDTO addTopic(TopicRequestDTO requestDTO) {
        Section section = sectionRepository.findById(requestDTO.getSectionId())
                .orElseThrow(() -> new RuntimeException("Section not found"));

        if (topicRepository.existsByTopicNameAndSection_SectionId(requestDTO.getTopicName(), requestDTO.getSectionId())) {
            throw new RuntimeException("Topic already exists in this section");
        }

        Topic topic = new Topic();
        topic.setSection(section);
        topic.setTopicName(requestDTO.getTopicName());
        topic.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : TopicStatus.ACTIVE);

        Topic saved = topicRepository.save(topic);
        return mapToResponse(saved);
    }

    @Override
    public TopicResponseDTO updateTopic(int id, TopicRequestDTO requestDTO) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Section section = sectionRepository.findById(requestDTO.getSectionId())
                .orElseThrow(() -> new RuntimeException("Section not found"));

        topic.setSection(section);
        topic.setTopicName(requestDTO.getTopicName());
        topic.setStatus(requestDTO.getStatus());

        Topic updated = topicRepository.save(topic);
        return mapToResponse(updated);
    }

    @Override
    public void deleteTopic(int id) {
        if (!topicRepository.existsById(id)) {
            throw new RuntimeException("Topic not found");
        }
        topicRepository.deleteById(id);
    }

    @Override
    public List<TopicResponseDTO> getAllTopics() {
        return topicRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TopicResponseDTO getTopicById(int id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        return mapToResponse(topic);
    }

    private TopicResponseDTO mapToResponse(Topic topic) {
        TopicResponseDTO response = new TopicResponseDTO();
        response.setTopicId(topic.getTopicId());
        response.setTopicName(topic.getTopicName());
        response.setStatus(topic.getStatus());

        if (topic.getSection() != null) {
            response.setSectionName(topic.getSection().getSectionName());

            if (topic.getSection().getSubject() != null) {
                response.setSubjectName(topic.getSection().getSubject().getSubjectName());

                if (topic.getSection().getSubject().getModule() != null) {
                    response.setModuleName(topic.getSection().getSubject().getModule().getModuleName());

                    if (topic.getSection().getSubject().getModule().getCourse() != null) {
                        response.setCourseName(topic.getSection().getSubject().getModule().getCourse().getCourseName());
                    }
                }
            }
        }
       
        return response;
    }
}
