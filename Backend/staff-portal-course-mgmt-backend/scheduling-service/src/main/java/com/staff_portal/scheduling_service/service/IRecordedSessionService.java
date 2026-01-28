package com.staff_portal.scheduling_service.service;

import com.staff_portal.scheduling_service.dto.request.RecordedSessionDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface IRecordedSessionService {

    RecordedSessionDTO createSession(@Valid RecordedSessionDTO sessionDto);

    RecordedSessionDTO updateSession(UUID id, @Valid RecordedSessionDTO sessionDto);

    RecordedSessionDTO getSessionById(UUID id);

    boolean deleteSession(UUID id);

    Page<RecordedSessionDTO> getSessionsByBatchCycleCourseAndDateRange(String batchCycleName, String courseName,
                                                                       LocalDate startDate, LocalDate endDate, int page, int size);

    List<RecordedSessionDTO> getAllRecordedSessions();

}
