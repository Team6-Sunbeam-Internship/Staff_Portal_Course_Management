package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.CourseTypeRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseTypeResponseDTO;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.model.CourseType;
import com.staff_portal.academic_service.repository.*;
import com.staff_portal.academic_service.service.interfaces.CourseTypeService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseTypeServiceImpl implements CourseTypeService {

    private final CourseTypeRepository courseTypeRepository;

    @Override
    public ApiResponse<UUID> createCourseType(CourseTypeRequestDTO requestDTO) {
        CourseType courseType = CourseType.builder()
                .courseTypeName(requestDTO.getTitle())
                .description(requestDTO.getDescription())
                .status(requestDTO.getStatus())
                .build();
        CourseType savedCourseType = courseTypeRepository.save(courseType);
        return ApiResponse.onSuccess(savedCourseType.getCourseTypeId());
    }

    @Override
    public ApiResponse<String> updateCourseType(UUID id, CourseTypeRequestDTO requestDTO) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course type with id: %s not found", id)));
        courseType.setCourseTypeName(requestDTO.getTitle());
        courseType.setDescription(requestDTO.getDescription());
        courseType.setStatus(requestDTO.getStatus());
        courseTypeRepository.save(courseType);
        return ApiResponse.onSuccess("Successfully updated course type with id: " + id);
    }

    @Override
    @Transactional
    public void deleteCourseType(UUID id) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course type with id: %s not found", id)));

        // Soft delete parent
        courseType.setDeleted(true);
        courseTypeRepository.save(courseType);
    }

    @Override
    public ApiResponse<List<CourseTypeResponseDTO>> getAllCourseTypes() {
        List<CourseTypeResponseDTO> listOfCourseType = courseTypeRepository
                .findByDeletedFalse()
                .stream()
                .map(courseType -> CourseTypeResponseDTO.builder()
                        .id(courseType.getCourseTypeId())
                        .title(courseType.getCourseTypeName())
                        .description(courseType.getDescription())
                        .status(courseType.getStatus())
                        .build())
                .toList();
        return ApiResponse.onSuccess(listOfCourseType);
    }
}
