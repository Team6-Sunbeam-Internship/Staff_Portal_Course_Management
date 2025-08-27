package com.staff_portal.scheduling_service.service.interfaces;

import java.util.List;

import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetResponseDTO;


public interface ITimeSheetService {
	
	TimeSheetResponseDTO createTimeSheet(TimeSheetRequestDTO requestDto);

	List<TimeSheetResponseDTO> getAllTimeSheets();
	
	TimeSheetResponseDTO getTimeSheetById(Long id);
	
	TimeSheetResponseDTO updateTimeSheet(Long id, TimeSheetRequestDTO requestDto);

	void deleteTimesheet(Long id);
}
