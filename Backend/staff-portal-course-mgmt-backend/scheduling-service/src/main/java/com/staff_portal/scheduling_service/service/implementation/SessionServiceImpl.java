package com.staff_portal.scheduling_service.service.implementation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.SessionReqRespDTO;
import com.staff_portal.scheduling_service.exception.ResourceNotFoundException;
import com.staff_portal.scheduling_service.mapper.SessionMapper;
import com.staff_portal.scheduling_service.model.Session;
import com.staff_portal.scheduling_service.repository.SessionRepository;
import com.staff_portal.scheduling_service.service.interfaces.ISessionService;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class SessionServiceImpl implements ISessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private EntityManager entityManager;
    
    private void enableDeletedFilter() {
    	org.hibernate.Session hibernateSession = entityManager.unwrap(org.hibernate.Session.class);
        hibernateSession.enableFilter("sessionDeletedFilter").setParameter("isDeleted", false); // exclude deleted
    }
    
    @Override
    public SessionReqRespDTO createSession(SessionReqRespDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Session request cannot be null");
        }
       

        Session session = SessionMapper.fromSessionRequestDTO(dto);
        Session saved = sessionRepository.save(session);
        return SessionMapper.toSessionReqRespDTO(saved);
    }

    @Override
    public List<SessionReqRespDTO> getAllSessions() {
    	
    	enableDeletedFilter();
        List<Session> sessions = sessionRepository.findAll();
        List<SessionReqRespDTO> dtoList = new ArrayList<>();

        for (Session session : sessions) {
            dtoList.add(SessionMapper.toSessionReqRespDTO(session));
        }
        return dtoList;
    }

    @Override
    public SessionReqRespDTO getSessionById(Long id) {
    	enableDeletedFilter();
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + id));
        return SessionMapper.toSessionReqRespDTO(session);
    }

    @Transactional
    @Override
    public SessionReqRespDTO updateSession(Long id, SessionReqRespDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Session request cannot be null");
        }

        Session existing = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with ID: " + id));

        existing.setTitle(dto.getTitle());
        existing.setMeetingId(dto.getMeetingId());
        existing.setMeetingCredentials(dto.getMeetingCredentials());
        existing.setStatus(dto.getStatus());
        existing.setDescription(dto.getDescription());
        existing.setCodeShareToken(dto.getCodeShareToken());
        existing.setSessionDate(dto.getSessionDate());
        existing.setStartTime(dto.getStartTime());
        existing.setEndTime(dto.getEndTime());
        existing.setStaffName(dto.getStaffName());
        existing.setBatchCycleName(dto.getBatchCycleName());
        existing.setCourseName(dto.getCourseName());
        
        Session updated = sessionRepository.save(existing);
        return SessionMapper.toSessionReqRespDTO(updated);
    }

    @Override
    public boolean deleteSession(Long id) {
        if (!sessionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Session not found with ID: " + id);
            
        }
        sessionRepository.deleteById(id);
        return true;
    }

	@Override
	public Page<SessionReqRespDTO> getSessionsByBatchCycleCourseAndDateRange(String batchCycleName, String courseName,
			LocalDate startDate, LocalDate endDate, int page, int size) {
		enableDeletedFilter();
		

    	
    	 Pageable pageable = PageRequest.of(page, size);
        Page<Session> entityPage = sessionRepository.findByBatchCycleCourseAndDateRange(
                batchCycleName, courseName, startDate, endDate, pageable);
        
        return entityPage.map(SessionMapper::toSessionReqRespDTO);
		
	}
}
