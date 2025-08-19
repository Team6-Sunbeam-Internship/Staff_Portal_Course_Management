package com.staff_portal.academic_service.service.implementation;

import java.util.List;

import org.springframework.stereotype.Service;

import com.staff_portal.academic_service.dto.request.CourseTypeRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseTypeResponseDTO;
import com.staff_portal.academic_service.service.interfaces.CourseTypeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseTypeServiceImpl implements CourseTypeService {

	@Override
	public CourseTypeResponseDTO addCourseType(CourseTypeRequestDTO requestDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public CourseTypeResponseDTO updateCourseType(int id, CourseTypeRequestDTO requestDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteCourseType(int id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<CourseTypeResponseDTO> getAllCourseTypes() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public CourseTypeResponseDTO getCourseTypeById(int id) {
		// TODO Auto-generated method stub
		return null;
	}
}