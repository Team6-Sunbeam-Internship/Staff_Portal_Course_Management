package com.staff_portal.scheduling_service.service.interfaces;

import java.util.List;

import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetTopicResponseDTO;

public interface ITimeSheetTopicService {

	TimeSheetTopicResponseDTO createTimeSheetTopic(TimeSheetTopicRequestDTO dto);
	
	List<TimeSheetTopicResponseDTO> getAllTimeSheetTopic();
}
