package com.staff_portal.academic_service.service.implementation;

import java.util.List;

import org.springframework.stereotype.Service;

import com.staff_portal.academic_service.dto.request.CourseTypeRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseTypeResponseDTO;
import com.staff_portal.academic_service.model.BatchCycle;
import com.staff_portal.academic_service.model.CourseType;
import com.staff_portal.academic_service.model.Premises;
import com.staff_portal.academic_service.repository.BatchCycleRepository;
import com.staff_portal.academic_service.repository.CourseTypeRepository;
import com.staff_portal.academic_service.repository.PremisesRepository;
import com.staff_portal.academic_service.service.interfaces.CourseTypeService;

import lombok.RequiredArgsConstructor;



import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseTypeServiceImpl implements CourseTypeService {

    private final CourseTypeRepository courseTypeRepository;
    private final BatchCycleRepository batchCycleRepository;
    private final PremisesRepository premisesRepository;

    @Override
    public CourseTypeResponseDTO addCourseType(CourseTypeRequestDTO requestDTO) {
        BatchCycle batchCycle = batchCycleRepository.findById(requestDTO.getBatchCycleId())
                .orElseThrow(() -> new RuntimeException("BatchCycle not found"));
        Premises premises = premisesRepository.findById(requestDTO.getPremisesId())
                .orElseThrow(() -> new RuntimeException("Premises not found"));

        CourseType courseType = new CourseType();
        courseType.setTypeName(requestDTO.getTypeName());
        courseType.setBatchCycle(batchCycle);
        courseType.setPremises(premises);

        CourseType saved = courseTypeRepository.save(courseType);

        return new CourseTypeResponseDTO(saved.getCourseTypeId(),
                saved.getTypeName(),
                saved.getBatchCycle().getBatchCycleId(),
                saved.getPremises().getPremisesId());
    }

    @Override
    public CourseTypeResponseDTO updateCourseType(int id, CourseTypeRequestDTO requestDTO) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CourseType not found"));

        BatchCycle batchCycle = batchCycleRepository.findById(requestDTO.getBatchCycleId())
                .orElseThrow(() -> new RuntimeException("BatchCycle not found"));
        Premises premises = premisesRepository.findById(requestDTO.getPremisesId())
                .orElseThrow(() -> new RuntimeException("Premises not found"));

        courseType.setTypeName(requestDTO.getTypeName());
        courseType.setBatchCycle(batchCycle);
        courseType.setPremises(premises);

        CourseType updated = courseTypeRepository.save(courseType);

        return new CourseTypeResponseDTO(updated.getCourseTypeId(),
                updated.getTypeName(),
                updated.getBatchCycle().getBatchCycleId(),
                updated.getPremises().getPremisesId());
    }

    @Override
    public void deleteCourseType(int id) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CourseType not found"));
        courseTypeRepository.delete(courseType);
    }

    @Override
    public List<CourseTypeResponseDTO> getAllCourseTypes() {
        return courseTypeRepository.findAll().stream()
                .map(ct -> new CourseTypeResponseDTO(ct.getCourseTypeId(),
                        ct.getTypeName(),
                        ct.getBatchCycle().getBatchCycleId(),
                        ct.getPremises().getPremisesId()))
                .collect(Collectors.toList());
    }

    @Override
    public CourseTypeResponseDTO getCourseTypeById(int id) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CourseType not found"));

        return new CourseTypeResponseDTO(courseType.getCourseTypeId(),
                courseType.getTypeName(),
                courseType.getBatchCycle().getBatchCycleId(),
                courseType.getPremises().getPremisesId());
    }
}
