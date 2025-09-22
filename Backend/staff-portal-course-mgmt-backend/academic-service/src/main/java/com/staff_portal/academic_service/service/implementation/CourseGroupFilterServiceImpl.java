package com.staff_portal.academic_service.service.implementation;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.staff_portal.academic_service.dto.response.CourseGroupFilterDTO;
import com.staff_portal.academic_service.enums.CourseGroupStatus;
import com.staff_portal.academic_service.repository.BatchCycleRepository;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.service.interfaces.CourseGroupFilterService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseGroupFilterServiceImpl implements CourseGroupFilterService {

	private final BatchCycleRepository batchCycleRepository;
	private final CourseRepository courseRepository;

	@Override
	public List<CourseGroupFilterDTO> getBatchCycles() {
		return batchCycleRepository.findAll().stream()
				.map(bc -> new CourseGroupFilterDTO(bc.getBatchCycleId(), bc.getCycleName()))
				.collect(Collectors.toList());
	}

	@Override
	public List<CourseGroupFilterDTO> getCourses() { 
		return courseRepository.findAll().stream()
				.map(c -> new CourseGroupFilterDTO(c.getCourseId(), c.getCourseName())).collect(Collectors.toList());
	}

	@Override
	public List<CourseGroupFilterDTO> getStatuses() {
		return Arrays.stream(CourseGroupStatus.values())
				.map(status -> new CourseGroupFilterDTO(status.ordinal(), status.name())).collect(Collectors.toList());
	}
}
