package com.staff_portal.scheduling_service.service.implementation;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;
import com.staff_portal.scheduling_service.exception.ResourceNotFoundException;
import com.staff_portal.scheduling_service.mapper.TimeSheetCourseModuleMapper;
import com.staff_portal.scheduling_service.model.TimeSheetCourseModule;
import com.staff_portal.scheduling_service.repository.TimeSheetCourseModuleRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetCourseModuleService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Transactional
@Service
public class TimeSheetCourseModuleServiceImpl implements ITimeSheetCourseModuleService {

    @Autowired
    private TimeSheetCourseModuleRepository courseModuleRepository;

    @Override
    public TimeSheetCourseModuleResponseDTO createTimeSheetCourseModule(TimeSheetCourseModuleRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Course module request cannot be null");
        }

        TimeSheetCourseModule entity = TimeSheetCourseModuleMapper.toEntity(dto);
        TimeSheetCourseModule saved = courseModuleRepository.save(entity);
        return TimeSheetCourseModuleMapper.toDto(saved);
    }

    @Override
    public List<TimeSheetCourseModuleResponseDTO> getAllTimeSheetCourseModule() {
        return courseModuleRepository.findAll()
                .stream()
                .map(TimeSheetCourseModuleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TimeSheetCourseModuleResponseDTO getTimeSheetCourseModuleById(UUID id) {
        TimeSheetCourseModule entity = courseModuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course module not found with ID: " + id));
        return TimeSheetCourseModuleMapper.toDto(entity);
    }

    @Override
    public TimeSheetCourseModuleResponseDTO updateTimeSheetCourseModule(UUID id, TimeSheetCourseModuleRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Course module request cannot be null");
        }

        TimeSheetCourseModule existing = courseModuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course module not found with ID: " + id));

        existing.setCourseName(dto.getCourseName());
        existing.setModuleName(dto.getModuleName());

        TimeSheetCourseModule updated = courseModuleRepository.save(existing);
        return TimeSheetCourseModuleMapper.toDto(updated);
    }

    @Override
    public void deleteTimeSheetCourseModule(UUID id) {
        if (!courseModuleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course module not found with ID: " + id);
        }
        courseModuleRepository.deleteById(id);
    }
}
