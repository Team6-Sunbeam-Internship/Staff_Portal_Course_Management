package com.staff_portal.scheduling_service.service.interfaces;

import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSlotResponseDTO;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

public interface ITimeSlotService {


    List<TimeSlotResponseDTO> getAllTimeSlots();

    TimeSlotResponseDTO getTimeSlotById(UUID id);

    TimeSlotResponseDTO createTimeSlot(@Valid TimeSlotRequestDTO dto);

    TimeSlotResponseDTO updateTimeSlot(UUID id, @Valid TimeSlotRequestDTO dto);

    void deleteTimeSlot(UUID id);
}

	


