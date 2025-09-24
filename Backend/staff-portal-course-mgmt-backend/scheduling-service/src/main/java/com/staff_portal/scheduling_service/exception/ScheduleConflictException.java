package com.staff_portal.scheduling_service.exception;

import java.util.List;

import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;



public class ScheduleConflictException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final List<ScheduleResponseDTO> conflicts;

    public ScheduleConflictException(String message, List<ScheduleResponseDTO> conflicts) {
        super(message);
        this.conflicts = conflicts;
    }

    public List<ScheduleResponseDTO> getConflicts() {
        return conflicts;
    }
}

