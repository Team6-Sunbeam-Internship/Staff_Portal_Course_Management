package com.staff_portal.scheduling_service.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;

import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetTopicResponseDTO;
import com.staff_portal.scheduling_service.mapper.TimeSheetTopicMapper;
import com.staff_portal.scheduling_service.model.TimeSheetTopic;
import com.staff_portal.scheduling_service.repository.TimeSheetTopicRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetTopicService;

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

}


