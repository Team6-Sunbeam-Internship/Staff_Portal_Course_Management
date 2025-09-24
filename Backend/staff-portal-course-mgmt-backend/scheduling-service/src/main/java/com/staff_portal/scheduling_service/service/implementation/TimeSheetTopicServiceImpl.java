package com.staff_portal.scheduling_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetTopicResponseDTO;
import com.staff_portal.scheduling_service.exception.ResourceNotFoundException;
import com.staff_portal.scheduling_service.mapper.TimeSheetTopicMapper;
import com.staff_portal.scheduling_service.model.TimeSheetTopic;
import com.staff_portal.scheduling_service.repository.TimeSheetTopicRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetTopicService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class TimeSheetTopicServiceImpl implements ITimeSheetTopicService {

    @Autowired
    private TimeSheetTopicRepository topicRepository;

    @Override
    public TimeSheetTopicResponseDTO createTimeSheetTopic(TimeSheetTopicRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("TimeSheet topic request cannot be null");
        }

        TimeSheetTopic topic = new TimeSheetTopic();
        topic.setTopicName(dto.getTopicName());

        TimeSheetTopic saved = topicRepository.save(topic);
        return TimeSheetTopicMapper.toDto(saved);
    }

    @Override
    public List<TimeSheetTopicResponseDTO> getAllTimeSheetTopic() {
        return topicRepository.findAll()
                .stream()
                .map(TimeSheetTopicMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TimeSheetTopicResponseDTO getTimeSheetTopicById(Long id) {
        TimeSheetTopic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSheet topic not found with ID: " + id));
        return TimeSheetTopicMapper.toDto(topic);
    }

    @Override
    public TimeSheetTopicResponseDTO updateTimeSheetTopic(Long id, TimeSheetTopicRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("TimeSheet topic request cannot be null");
        }

        TimeSheetTopic existing = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSheet topic not found with ID: " + id));

        existing.setTopicName(dto.getTopicName());

        TimeSheetTopic updated = topicRepository.save(existing);
        return TimeSheetTopicMapper.toDto(updated);
    }

    @Override
    public void deleteTimeSheetTopic(Long id) {
        if (!topicRepository.existsById(id)) {
            throw new ResourceNotFoundException("TimeSheet topic not found with ID: " + id);
        }
        topicRepository.deleteById(id);
    }
}

