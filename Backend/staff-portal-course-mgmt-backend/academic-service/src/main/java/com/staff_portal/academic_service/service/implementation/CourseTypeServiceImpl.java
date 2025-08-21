package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.CourseTypeRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseTypeResponseDTO;
import com.staff_portal.academic_service.enums.CourseTypeStatus;

import java.util.List;

import org.springframework.stereotype.Service;
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

        if (courseTypeRepository.existsByTypeNameAndBatchCycle_BatchCycleId(requestDTO.getTypeName(), requestDTO.getBatchCycleId())) {
            throw new RuntimeException("CourseType already exists for this batch cycle");
        }

        CourseType courseType = new CourseType();
        courseType.setTypeName(requestDTO.getTypeName());
        courseType.setDescription(requestDTO.getDescription());
        courseType.setBatchCycle(batchCycle);
        courseType.setPremises(premises);
        courseType.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : CourseTypeStatus.ACTIVE);

        CourseType saved = courseTypeRepository.save(courseType);
        return mapToResponse(saved);
        
    }

    @Override
    public CourseTypeResponseDTO updateCourseType(int id, CourseTypeRequestDTO requestDTO) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CourseType not found"));

        courseType.setTypeName(requestDTO.getTypeName());
        courseType.setDescription(requestDTO.getDescription());
        courseType.setStatus(requestDTO.getStatus());

        // update relations if needed
        BatchCycle batchCycle = batchCycleRepository.findById(requestDTO.getBatchCycleId())
                .orElseThrow(() -> new RuntimeException("BatchCycle not found"));
        Premises premises = premisesRepository.findById(requestDTO.getPremisesId())
                .orElseThrow(() -> new RuntimeException("Premises not found"));

        courseType.setBatchCycle(batchCycle);
        courseType.setPremises(premises);

        courseTypeRepository.save(courseType);
        return mapToResponse(courseType);
       
    }

    @Override
    public void deleteCourseType(int id) {
        if (!courseTypeRepository.existsById(id)) {
            throw new RuntimeException("CourseType not found");
        }
        courseTypeRepository.deleteById(id);
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CourseType not found"));
        courseTypeRepository.delete(courseType);
    }

    @Override
    public List<CourseTypeResponseDTO> getAllCourseTypes() {
        return courseTypeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CourseTypeResponseDTO getCourseTypeById(int id) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CourseType not found"));
        return mapToResponse(courseType);
    }

    private CourseTypeResponseDTO mapToResponse(CourseType courseType) {
        CourseTypeResponseDTO response = new CourseTypeResponseDTO();
        response.setCourseTypeId(courseType.getCourseTypeId());
        response.setTypeName(courseType.getTypeName());
        response.setDescription(courseType.getDescription());
        response.setStatus(courseType.getStatus());
        response.setBatchCycleId(courseType.getBatchCycle().getBatchCycleId());
        response.setCycleName(courseType.getBatchCycle().getCycleName());
        response.setPremisesId(courseType.getPremises().getPremisesId());

        return response;
    }
}
