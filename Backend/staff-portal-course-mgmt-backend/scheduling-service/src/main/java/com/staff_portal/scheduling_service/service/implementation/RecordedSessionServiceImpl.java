package com.staff_portal.scheduling_service.service.implementation;

import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.staff_portal.scheduling_service.dto.request.RecordedSessionDTO;
import com.staff_portal.scheduling_service.exception.ResourceNotFoundException;
import com.staff_portal.scheduling_service.mapper.RecordedSessionMapper;
import com.staff_portal.scheduling_service.model.RecordedSession;
import com.staff_portal.scheduling_service.repository.RecordedSessionRepository;
import com.staff_portal.scheduling_service.service.IRecordedSessionService;

@Service
@Transactional
public class RecordedSessionServiceImpl implements IRecordedSessionService {
    
	 @Autowired
	    private RecordedSessionRepository recordedSessionRepository;

	    @Autowired
	    private EntityManager entityManager;
	    
	    private void enableDeletedFilter() {
	    	org.hibernate.Session hibernateSession = entityManager.unwrap(org.hibernate.Session.class);
	        hibernateSession.enableFilter("recordedSessionDeletedFilter").setParameter("isDeleted", false); // exclude deleted
	    }
    
    @Override
    public RecordedSessionDTO createSession(RecordedSessionDTO sessionDto) {
    	 if (sessionDto == null) {
             throw new IllegalArgumentException("Session request cannot be null");
         }
        
        RecordedSession entity = RecordedSessionMapper.toEntity(sessionDto);
        RecordedSession savedEntity = recordedSessionRepository.save(entity);
        
        return RecordedSessionMapper.toDto(savedEntity);
    }
    
    @Override
    public RecordedSessionDTO updateSession(Long id, RecordedSessionDTO sessionDto) {
    	if (sessionDto == null) {
            throw new IllegalArgumentException("Session request cannot be null");
        }
        
        RecordedSession existingEntity = recordedSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RecordedSession not found with id: " + id));
        
        existingEntity.setTitle(sessionDto.getTitle());
        existingEntity.setBatchCycleName(sessionDto.getBatchCycleName());
        existingEntity.setChannel(sessionDto.getChannel());
        existingEntity.setCourseName(sessionDto.getCourseName());
        existingEntity.setDescription(sessionDto.getDescription());
        existingEntity.setSessionDate(sessionDto.getSessionDate());
        existingEntity.setStaffName(sessionDto.getStaffName());
        existingEntity.setUrl(sessionDto.getUrl());
        
        RecordedSession updatedEntity = recordedSessionRepository.save(existingEntity);
        
       
        return RecordedSessionMapper.toDto(updatedEntity);
    }
    
    @Override
    
    public RecordedSessionDTO getSessionById(Long id) {
        enableDeletedFilter();
        RecordedSession entity = recordedSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RecordedSession not found with id: " + id));
        
        return RecordedSessionMapper.toDto(entity);
    }
    
    @Override
    public boolean deleteSession(Long id) {
        
        if (!recordedSessionRepository.existsById(id)) {
            throw new ResourceNotFoundException("RecordedSession not found with id: " + id);
        }
        
        recordedSessionRepository.deleteById(id);
        return true;
    }
    
   
    @Override
    public Page<RecordedSessionDTO>getSessionsByBatchCycleCourseAndDateRange(
			String batchCycleName,
			 String courseName,
			 LocalDate startDate,
			 LocalDate endDate,
			 int page,
			 int size) {
    	
    	enableDeletedFilter();
    	 Pageable pageable = PageRequest.of(page, size);
        Page<RecordedSession> entityPage = recordedSessionRepository.findByBatchCycleCourseAndDateRange(
                batchCycleName, courseName, startDate, endDate, pageable);
        
        return entityPage.map(RecordedSessionMapper::toDto);
    }

	@Override
	public List<RecordedSessionDTO> getAllRecordedSessions() {
		enableDeletedFilter();
        List<RecordedSession> sessions = recordedSessionRepository.findAll();
        List<RecordedSessionDTO> dtoList = new ArrayList<>();

        for (RecordedSession session : sessions) {
            dtoList.add(RecordedSessionMapper.toDto(session));
        }
        return dtoList;
		
	}
    
 
    
    
}