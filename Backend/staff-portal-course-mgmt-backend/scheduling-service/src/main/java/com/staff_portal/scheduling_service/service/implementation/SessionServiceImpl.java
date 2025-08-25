package com.staff_portal.scheduling_service.service.implementation;



import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.SessionReqRespDTO;
import com.staff_portal.scheduling_service.mapper.SessionMapper;
import com.staff_portal.scheduling_service.model.Session;
import com.staff_portal.scheduling_service.repository.SessionRepository;
import com.staff_portal.scheduling_service.service.interfaces.ISessionService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class SessionServiceImpl implements ISessionService {

	
	 @Autowired
	    private SessionRepository sessionRepository;

	@Override
	public SessionReqRespDTO createSession(SessionReqRespDTO dto) {
		
	        Session session = SessionMapper.fromSessionRequestDTO(dto);
	        Session saved = sessionRepository.save(session);
	        return SessionMapper.toSessionReqRespDTO(saved);
	    }

	
		@Override
	    public List<SessionReqRespDTO> getAllSessions() {
	        List<Session> sessions = sessionRepository.findAll();
	        List<SessionReqRespDTO> dtoList = new ArrayList<>();

	        for (Session session : sessions) {
	            SessionReqRespDTO dto = SessionMapper.toSessionReqRespDTO(session);
	            dtoList.add(dto);
	        }

	        return dtoList;
	}
		
		@Override
	    public SessionReqRespDTO getSessionById(Long id) {
	        Optional<Session> sessionOpt = sessionRepository.findById(id);
	        if (sessionOpt.isPresent()) {
	        	 return SessionMapper.toSessionReqRespDTO(sessionOpt.get());
	        }
	        return null;
		}
		
		@Override
	    public SessionReqRespDTO updateSession(Long id,SessionReqRespDTO dto) {
	        Optional<Session> existingOpt = sessionRepository.findById(id);
	        if (existingOpt.isPresent()) {
	            Session existing = existingOpt.get();
	            existing.setTitle(dto.getTitle());
	            existing.setMeetingId(dto.getMeetingId());
	            existing.setMeetingCredentials(dto.getMeetingCredentials());
	            existing.setStatus(dto.getStatus());
	            existing.setDescription(dto.getDescription());
	            existing.setCodeShareToken(dto.getCodeShareToken());
	            existing.setSessionDate(dto.getSessionDate());
                existing.setStartTime(dto.getStartTime());
                existing.setEndTime(dto.getEndTime());
	            existing.setStaffId(dto.getStaffId());

	            Session updated = sessionRepository.save(existing);
	            return SessionMapper.toSessionReqRespDTO(updated);
	        }

	        return null;
	    }
		
		 @Override
		    public boolean deleteSession(Long id) {
		        if (sessionRepository.existsById(id)) {
		            sessionRepository.deleteById(id);
		            return true;
		        }
		        return false;
		    }

}
