package com.staff_portal.scheduling_service.service.interfaces;

import java.util.List;

import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSlotResponseDTO;

import jakarta.validation.Valid;

public interface ITimeSlotService  {

	
	List<TimeSlotResponseDTO> getAllTimeSlots();

}

	


