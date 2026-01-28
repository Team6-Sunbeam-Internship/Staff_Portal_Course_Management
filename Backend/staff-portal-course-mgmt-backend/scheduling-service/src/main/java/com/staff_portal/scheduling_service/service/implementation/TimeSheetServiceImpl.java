package com.staff_portal.scheduling_service.service.implementation;

import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetResponseDTO;
import com.staff_portal.scheduling_service.exception.ResourceNotFoundException;
import com.staff_portal.scheduling_service.mapper.TimeSheetMapper;
import com.staff_portal.scheduling_service.model.TimeSheet;
import com.staff_portal.scheduling_service.model.TimeSheetCourseModule;
import com.staff_portal.scheduling_service.model.TimeSheetTopic;
import com.staff_portal.scheduling_service.repository.TimeSheetCourseModuleRepository;
import com.staff_portal.scheduling_service.repository.TimeSheetRepository;
import com.staff_portal.scheduling_service.repository.TimeSheetTopicRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Transactional
@Service
public class TimeSheetServiceImpl implements ITimeSheetService {

    @Autowired
    private TimeSheetRepository timeSheetRepository;

    @Autowired
    private TimeSheetCourseModuleRepository courseModuleRepository;

    @Autowired
    private TimeSheetTopicRepository topicRepository;

    @Autowired
    private EntityManager entityManager;

    private void enableDeletedFilter() {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("timesheetDeletedFilter").setParameter("isDeleted", false); // exclude deleted
    }

    @Override
    public TimeSheetResponseDTO createTimeSheet(TimeSheetRequestDTO requestDto) {

        if (requestDto == null) {
            throw new IllegalArgumentException("TimeSheet request cannot be null");
        }


        TimeSheet timeSheet = TimeSheetMapper.toEntity(requestDto);
        TimeSheetCourseModule timeSheetCourseModule = timeSheet.getCourseModule();
        TimeSheetCourseModule courseModule = courseModuleRepository.save(timeSheetCourseModule);
        for (TimeSheetTopic topic : timeSheet.getTimeSheetTopics()) {
            topic.setTimeSheet(timeSheet); // 🔁 Set the parent
        }
        TimeSheet saved = timeSheetRepository.save(timeSheet);

        return TimeSheetMapper.toDto(saved);
    }

    @Override
    public List<TimeSheetResponseDTO> getAllTimeSheets() {

        enableDeletedFilter();
        return timeSheetRepository.findAll().stream().map(TimeSheetMapper::toDto).collect(Collectors.toList());

    }

    @Override
    public TimeSheetResponseDTO getTimeSheetById(UUID id) {

        enableDeletedFilter();
        TimeSheet timeSheet = timeSheetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSheet not found with ID: " + id));
        return TimeSheetMapper.toDto(timeSheet);
    }

    @Override
    public TimeSheetResponseDTO updateTimeSheet(UUID id, TimeSheetRequestDTO requestDto) {

        if (requestDto == null) {
            throw new IllegalArgumentException("TimeSheet request cannot be null");
        }
        TimeSheet existing = timeSheetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSheet not found with ID: " + id));
        //        TimeSheet updated = TimeSheetMapper.toEntity(requestDto);
        //        TimeSheetCourseModule module1 = updated.getCourseModule();
        //        updated.setId(id); // maintain the same ID
        //        TimeSheetTopic topic = existing.getTimeSheetTopic();
        //        TimeSheetCourseModule module =  existing.getCourseModule();
        //        UUID moduleId = module.getId();
        //        UUID topicId = topic.getId();
        //        TimeSheetTopic topic1 = updated.getTimeSheetTopic();
        //         updated.getCourseModule().setId(moduleId);
        //        topic1.setId(topicId);
        //        updated.setTimeSheetTopic(topic1);
        //	     topic1.setTimeSheet(updated);
        //	     updated.setCourseModule(module1);

        existing.setAssignment(requestDto.getAssignment());
        TimeSheetCourseModule module = courseModuleRepository.findById(existing.getCourseModule().getId())
                .orElseThrow(() -> new ResourceNotFoundException("CourseModule not found with ID" + existing.getCourseModule().getId()));
        module.setCourseName(requestDto.getCourseModule().getCourseName());
        module.setModuleName(requestDto.getCourseModule().getModuleName());
        existing.setDurationHours(requestDto.getDurationHours());
        existing.setEndTime(requestDto.getEndTime());
        existing.setExtraTopic(requestDto.getExtraTopic());
        existing.setLogDate(requestDto.getLogDate());
        existing.setStaffName(requestDto.getStaffName());
        existing.setStartTime(requestDto.getStartTime());
        existing.setStatus(requestDto.getStatus());
        existing.setBatchCycleName(requestDto.getBatchCycleName());
        List<TimeSheetTopic> topics = existing.getTimeSheetTopics();
        //		existing.getTimeSheetTopics().clear();
        //		existing.setTimeSheetTopics(requestDto.getTimeSheetTopics().stream().map(TimeSheetTopicMapper::toEntity)
        //				.collect(Collectors.toList()));
        //		for (TimeSheetTopic topic : existing.getTimeSheetTopics()) {
        //			topic.setTimeSheet(existing); //
        //		}
        //		for (TimeSheetTopicRequestDTO topicDTO : requestDto.getTimeSheetTopics())
        for (int i = 0; i < requestDto.getTimeSheetTopics().size(); i++) {
            TimeSheetTopic topic = new TimeSheetTopic();
            TimeSheetTopicRequestDTO topicDTO = requestDto.getTimeSheetTopics().get(i);
            if ((i + 1) <= topics.size()) {
                UUID idTopic = topics.get(i).getId();
                topic = topicRepository.findById(topics.get(i).getId()).orElseThrow(() -> new ResourceNotFoundException("TimeSheetTopic not found with ID" + idTopic));

                topic.setTopicName(topicDTO.getTopicName());
                topic.setTimeSheet(existing);
                //	        existing.getTimeSheetTopics().add(topic);
            }
            //			else {
            //				topic.setTopicId(topicDTO.getTopicId());
            //		        topic.setTimeSheet(existing);
            //		        existing.getTimeSheetTopics().add(topic);
            //			}
        }
        existing.setCourseModule(module);
        TimeSheet saved = timeSheetRepository.save(existing);
        return TimeSheetMapper.toDto(saved);
    }

    @Override
    public void deleteTimesheet(UUID id) {
        if (!timeSheetRepository.existsById(id)) {
            throw new ResourceNotFoundException("TimeSheet not found with ID: " + id);
        }
        timeSheetRepository.deleteById(id);


    }

    @Override
    public Page<TimeSheetResponseDTO> getFilteredTimeSheets(
            String batchCycleName,
            String courseName,
            String moduleName,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size) {
        enableDeletedFilter();

        Pageable pageable = PageRequest.of(page, size);
        Page<TimeSheet> result = timeSheetRepository.findTimeSheetsByFilters(
                batchCycleName, courseName, moduleName, startDate, endDate, pageable);

        return result.map(TimeSheetMapper::toDto);
    }

}

