package com.staff_portal.scheduling_service.mapper;

import com.staff_portal.scheduling_service.dto.request.SessionReqRespDTO;
import com.staff_portal.scheduling_service.model.Session;

public class SessionMapper {

	 public static SessionReqRespDTO toSessionReqRespDTO(Session session) {
	        if (session == null) {
	            return null;
	        }

	        SessionReqRespDTO dto = new SessionReqRespDTO();
	        dto.setId(session.getId());
	        dto.setTitle(session.getTitle());
	        dto.setStartTime(session.getStartTime());
	        dto.setEndTime(session.getEndTime());
	        dto.setMeetingId(session.getMeetingId());
	        dto.setMeetingCredentials(session.getMeetingCredentials());
	        dto.setStatus(session.getStatus());
	        dto.setDescription(session.getDescription());
	        dto.setCodeShareToken(session.getCodeShareToken());
	        dto.setSessionDate(session.getSessionDate());
	        dto.setStaffName(session.getStaffName());
	        dto.setBatchCycleName(session.getBatchCycleName());
	        dto.setCourseName(session.getCourseName());

	        return dto;
	    }

	    public static Session fromSessionRequestDTO(SessionReqRespDTO dto){
	        if (dto == null) {
	            return null;
	        }

	        Session session = new Session();
	        session.setStaffName(dto.getStaffName());
	        session.setTitle(dto.getTitle());
	        session.setStartTime(dto.getStartTime());
	        session.setEndTime(dto.getEndTime());
	        session.setMeetingId(dto.getMeetingId());
	        session.setMeetingCredentials(dto.getMeetingCredentials());
	        session.setStatus(dto.getStatus());
	        session.setDescription(dto.getDescription());
	        session.setCodeShareToken(dto.getCodeShareToken());
	        session.setSessionDate(dto.getSessionDate());
           session.setBatchCycleName(dto.getBatchCycleName());
           session.setCourseName(dto.getCourseName());
	        return session;
	    }
}

