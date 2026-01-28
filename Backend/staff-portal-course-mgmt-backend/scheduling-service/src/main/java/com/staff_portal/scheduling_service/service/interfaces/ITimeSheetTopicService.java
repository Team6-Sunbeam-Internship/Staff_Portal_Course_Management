package com.staff_portal.scheduling_service.service.interfaces;

import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetTopicResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ITimeSheetTopicService {

    TimeSheetTopicResponseDTO createTimeSheetTopic(TimeSheetTopicRequestDTO dto);

    List<TimeSheetTopicResponseDTO> getAllTimeSheetTopic();

    TimeSheetTopicResponseDTO getTimeSheetTopicById(UUID id);

    TimeSheetTopicResponseDTO updateTimeSheetTopic(UUID id, TimeSheetTopicRequestDTO dto);

    void deleteTimeSheetTopic(UUID id);
}

