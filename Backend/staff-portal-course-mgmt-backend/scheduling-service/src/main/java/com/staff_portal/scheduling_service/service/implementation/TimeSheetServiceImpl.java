package com.staff_portal.scheduling_service.service.implementation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetResponseDTO;
import com.staff_portal.scheduling_service.mapper.TimeSheetCourseModuleMapper;
import com.staff_portal.scheduling_service.mapper.TimeSheetMapper;
import com.staff_portal.scheduling_service.mapper.TimeSheetTopicMapper;
import com.staff_portal.scheduling_service.model.TimeSheet;
import com.staff_portal.scheduling_service.model.TimeSheetCourseModule;
import com.staff_portal.scheduling_service.model.TimeSheetTopic;
import com.staff_portal.scheduling_service.repository.TimeSheetCourseModuleRepository;
import com.staff_portal.scheduling_service.repository.TimeSheetRepository;
import com.staff_portal.scheduling_service.repository.TimeSheetTopicRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class TimeSheetServiceImpl implements ITimeSheetService {

	@Autowired
	private TimeSheetRepository TimeSheetRepository;

	@Autowired
	private TimeSheetCourseModuleRepository courseModuleRepository;

	@Autowired
	private TimeSheetTopicRepository topicRepository;

	@Override
	public TimeSheetResponseDTO createTimeSheet(TimeSheetRequestDTO requestDto) {

		TimeSheet timeSheet = TimeSheetMapper.toEntity(requestDto);
		TimeSheetCourseModule timeSheetCourseModule = timeSheet.getCourseModule();
		TimeSheetCourseModule courseModule = courseModuleRepository.save(timeSheetCourseModule);
		for (TimeSheetTopic topic : timeSheet.getTimeSheetTopics()) {
			topic.setTimeSheet(timeSheet); // 🔁 Set the parent
		}
		TimeSheet saved = TimeSheetRepository.save(timeSheet);

		return TimeSheetMapper.toDto(saved);
	}

	@Override
	public List<TimeSheetResponseDTO> getAllTimeSheets() {

		return TimeSheetRepository.findAll().stream().map(TimeSheetMapper::toDto).collect(Collectors.toList());

	}

	@Override
	public TimeSheetResponseDTO getTimeSheetById(Long id) {

		TimeSheet TimeSheet = TimeSheetRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("TimeSheet not found"));
		return TimeSheetMapper.toDto(TimeSheet);
	}

	@Override
	public TimeSheetResponseDTO updateTimeSheet(Long id, TimeSheetRequestDTO requestDto) {
		TimeSheet existing = TimeSheetRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("TimeSheet not found"));
//        TimeSheet updated = TimeSheetMapper.toEntity(requestDto);
//        TimeSheetCourseModule module1 = updated.getCourseModule();
//        updated.setId(id); // maintain the same ID
//        TimeSheetTopic topic = existing.getTimeSheetTopic();
//        TimeSheetCourseModule module =  existing.getCourseModule();
//        Long moduleId = module.getId();
//        Long topicId = topic.getId();
//        TimeSheetTopic topic1 = updated.getTimeSheetTopic();
//         updated.getCourseModule().setId(moduleId);
//        topic1.setId(topicId);
//        updated.setTimeSheetTopic(topic1);
//	     topic1.setTimeSheet(updated);
//	     updated.setCourseModule(module1);

		existing.setAssignment(requestDto.getAssignment());
		TimeSheetCourseModule module = courseModuleRepository.findById(existing.getCourseModule().getId())
				.orElseThrow(() -> new RuntimeException("CourseModule not found"));
		module.setCourseId(requestDto.getCourseModule().getCourseId());
		module.setModuleId(requestDto.getCourseModule().getModuleId());
		existing.setDurationHours(requestDto.getDurationHours());
		existing.setEndTime(requestDto.getEndTime());
		existing.setExtraTopic(requestDto.getExtraTopic());
		existing.setLogDate(requestDto.getLogDate());
		existing.setStaffId(requestDto.getStaffId());
		existing.setStartTime(requestDto.getStartTime());
		existing.setStatus(requestDto.getStatus());
		List<TimeSheetTopic>topics = existing.getTimeSheetTopics();
//		existing.getTimeSheetTopics().clear();
//		existing.setTimeSheetTopics(requestDto.getTimeSheetTopics().stream().map(TimeSheetTopicMapper::toEntity)
//				.collect(Collectors.toList()));
//		for (TimeSheetTopic topic : existing.getTimeSheetTopics()) {
//			topic.setTimeSheet(existing); // 
//		}
//		for (TimeSheetTopicRequestDTO topicDTO : requestDto.getTimeSheetTopics())
		for (int i = 0; i < requestDto.getTimeSheetTopics().size(); i++)
		{    
			TimeSheetTopic topic = new TimeSheetTopic();
			TimeSheetTopicRequestDTO topicDTO = requestDto.getTimeSheetTopics().get(i);
			if((i+1)<=topics.size()) {
	        topic = topicRepository.findById(topics.get(i).getId()).orElseThrow(() -> new RuntimeException("TimeSheetTopic not found"));
			
	        topic.setTopicId(topicDTO.getTopicId());
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
		TimeSheet saved = TimeSheetRepository.save(existing);
		return TimeSheetMapper.toDto(saved);
	}

	@Override
	public void deleteTimesheet(Long id) {
		TimeSheetRepository.deleteById(id);
	}

}
