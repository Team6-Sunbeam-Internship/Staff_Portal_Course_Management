package com.staff_portal.scheduling_service.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSlotResponseDTO;
import com.staff_portal.scheduling_service.mapper.TimeSlotMapper;
import com.staff_portal.scheduling_service.model.TimeSlot;
import com.staff_portal.scheduling_service.repository.TimeSlotRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSlotService;

import jakarta.transaction.Transactional;

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

}

