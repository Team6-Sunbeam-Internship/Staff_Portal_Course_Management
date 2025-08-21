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
	        }
	        return null;
		}

}
