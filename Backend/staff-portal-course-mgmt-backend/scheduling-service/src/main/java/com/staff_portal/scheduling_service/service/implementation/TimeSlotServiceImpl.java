package com.staff_portal.scheduling_service.service.implementation;

import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSlotResponseDTO;
import com.staff_portal.scheduling_service.exception.ResourceNotFoundException;
import com.staff_portal.scheduling_service.mapper.TimeSlotMapper;
import com.staff_portal.scheduling_service.model.TimeSlot;
import com.staff_portal.scheduling_service.repository.TimeSlotRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSlotService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TimeSlotServiceImpl implements ITimeSlotService {

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Override
    public List<TimeSlotResponseDTO> getAllTimeSlots() {
        List<TimeSlot> slots = timeSlotRepository.findAll();
        List<TimeSlotResponseDTO> dtoList = new ArrayList<>();

        for (TimeSlot slot : slots) {
            dtoList.add(TimeSlotMapper.toTimeSlotResponseDTO(slot));
        }
        return dtoList;
    }

    @Override
    public TimeSlotResponseDTO getTimeSlotById(UUID id) {
        TimeSlot timeSlot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot not found with ID: " + id));
        return TimeSlotMapper.toTimeSlotResponseDTO(timeSlot);
    }

    @Override
    public TimeSlotResponseDTO createTimeSlot(TimeSlotRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("TimeSlot request cannot be null");
        }


        TimeSlot entity = TimeSlotMapper.fromTimeSlotRequestDTO(dto);
        TimeSlot saved = timeSlotRepository.save(entity);
        return TimeSlotMapper.toTimeSlotResponseDTO(saved);
    }

    @Transactional
    @Override
    public TimeSlotResponseDTO updateTimeSlot(UUID id, TimeSlotRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("TimeSlot request cannot be null");
        }

        TimeSlot existing = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot not found with ID: " + id));

        existing.setStartTime(dto.getStartTime());
        existing.setEndTime(dto.getEndTime());
//        existing.setSlotName(dto.getSlotName());

        TimeSlot updated = timeSlotRepository.save(existing);
        return TimeSlotMapper.toTimeSlotResponseDTO(updated);
    }

    @Override
    public void deleteTimeSlot(UUID id) {
        if (!timeSlotRepository.existsById(id)) {
            throw new ResourceNotFoundException("TimeSlot not found with ID: " + id);
        }
        timeSlotRepository.deleteById(id);
    }
}
