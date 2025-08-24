package com.staff_portal.scheduling_service.mapper;



import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;

import com.staff_portal.scheduling_service.dto.response.TimeSheetTopicResponseDTO;

import com.staff_portal.scheduling_service.model.TimeSheetTopic;

public class TimeSheetTopicMapper {

	public static TimeSheetTopic toEntity(TimeSheetTopicRequestDTO topicDto) {
	 TimeSheetTopic newTopic = new TimeSheetTopic();
     newTopic.setTopicId( topicDto.getTopicId());
     
     return newTopic;
	}
     
	 public static TimeSheetTopicResponseDTO toDto(TimeSheetTopic entity) {
     TimeSheetTopicResponseDTO topicDto = new TimeSheetTopicResponseDTO();
     topicDto.setTopicId(entity.getTopicId());
     
     return topicDto;
	 }
}
