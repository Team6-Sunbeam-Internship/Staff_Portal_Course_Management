package com.staff_portal.scheduling_service.service.interfaces;

import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetResponseDTO;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


public interface ITimeSheetService {

    TimeSheetResponseDTO createTimeSheet(TimeSheetRequestDTO requestDto);

    List<TimeSheetResponseDTO> getAllTimeSheets();

    TimeSheetResponseDTO getTimeSheetById(UUID id);

    TimeSheetResponseDTO updateTimeSheet(UUID id, TimeSheetRequestDTO requestDto);

    void deleteTimesheet(UUID id);

    Page<TimeSheetResponseDTO> getFilteredTimeSheets(String batchCycleName, String courseName, String moduleName,
                                                     LocalDate startDate, LocalDate endDate, int page, int size);
}
