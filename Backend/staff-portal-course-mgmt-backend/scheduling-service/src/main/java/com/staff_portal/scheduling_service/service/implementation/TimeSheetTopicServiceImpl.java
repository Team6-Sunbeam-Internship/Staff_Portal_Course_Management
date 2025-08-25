package com.staff_portal.scheduling_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetTopicResponseDTO;
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
		TimeSheetTopic topic = new TimeSheetTopic();
		topic.setTopicId(dto.getTopicId());

		TimeSheetTopic saved = topicRepository.save(topic);
		return TimeSheetTopicMapper.toDto(saved);
	}

	@Override
	public List<TimeSheetTopicResponseDTO> getAllTimeSheetTopic() {
		return topicRepository.findAll().stream().map(TimeSheetTopicMapper::toDto).collect(Collectors.toList());
	}

	@Override
	public TimeSheetTopicResponseDTO getTimeSheetTopicById(Long id) {
		TimeSheetTopic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TimeSheet topic not found with id: " + id));
        return TimeSheetTopicMapper.toDto(topic);
	}
}
