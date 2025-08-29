
package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;
import com.staff_portal.academic_service.model.BatchCycle;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseType;
import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.enums.ModuleStatus;
import com.staff_portal.academic_service.repository.BatchCycleRepository;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.repository.CourseTypeRepository;
import com.staff_portal.academic_service.repository.ModuleRepository;
import com.staff_portal.academic_service.service.interfaces.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final BatchCycleRepository batchCycleRepository;

    @Override
    public ModuleResponseDTO addModule(ModuleRequestDTO requestDTO) {
        Course course = courseRepository.findById(requestDTO.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        CourseType courseType = courseTypeRepository.findById(requestDTO.getCourseTypeId())
                .orElseThrow(() -> new RuntimeException("CourseType not found"));
        BatchCycle batchCycle = batchCycleRepository.findById(requestDTO.getBatchCycleId())
                .orElseThrow(() -> new RuntimeException("BatchCycle not found"));

        if (moduleRepository.existsByModuleNameAndCourse_CourseId(requestDTO.getModuleName(), requestDTO.getCourseId())) {
            throw new RuntimeException("Module already exists for this course");
        }

        Module module = new Module();
        module.setModuleName(requestDTO.getModuleName());
        module.setCourse(course);
        module.setCourseType(courseType);
        module.setBatchCycle(batchCycle);
        module.setStaffId(requestDTO.getStaffId());
        module.setTheoryHours(requestDTO.getTheoryHours());
        module.setPracticalHours(requestDTO.getPracticalHours());
        module.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : ModuleStatus.ACTIVE);

        Module saved = moduleRepository.save(module);
        return mapToResponse(saved);
    }

    @Override
    public ModuleResponseDTO updateModule(int id, ModuleRequestDTO requestDTO) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        module.setModuleName(requestDTO.getModuleName());
        module.setStaffId(requestDTO.getStaffId());
        module.setTheoryHours(requestDTO.getTheoryHours());
        module.setPracticalHours(requestDTO.getPracticalHours());
        module.setStatus(requestDTO.getStatus());

        moduleRepository.save(module);
        return mapToResponse(module);
    }

    @Override
    public void deleteModule(int id) {
        if (!moduleRepository.existsById(id)) {
            throw new RuntimeException("Module not found");
        }
        moduleRepository.deleteById(id);
    }

    @Override
    public List<ModuleResponseDTO> getAllModules() {
        return moduleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ModuleResponseDTO getModuleById(int id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        return mapToResponse(module);
    }
    
    @Override
    public List<ModuleResponseDTO> getModulesByFilters(String batchCycleName, String courseTypeName, String courseName) {
        List<Module> modules;

        if (batchCycleName != null && courseTypeName != null && courseName != null) {
            modules = moduleRepository.findByCourse_CourseType_BatchCycle_CycleNameIgnoreCaseAndCourse_CourseType_TypeNameIgnoreCaseAndCourse_CourseNameIgnoreCase(
                    batchCycleName, courseTypeName, courseName);
        } else if (batchCycleName != null && courseTypeName != null) {
            modules = moduleRepository.findByCourse_CourseType_BatchCycle_CycleNameIgnoreCaseAndCourse_CourseType_TypeNameIgnoreCase(
                    batchCycleName, courseTypeName);
        } else if (batchCycleName != null) {
            modules = moduleRepository.findByCourse_CourseType_BatchCycle_CycleNameIgnoreCase(batchCycleName);
        } else if (courseTypeName != null) {
            modules = moduleRepository.findByCourse_CourseType_TypeNameIgnoreCase(courseTypeName);
        } else if (courseName != null) {
            modules = moduleRepository.findByCourse_CourseNameIgnoreCase(courseName);
        } else {
            modules = moduleRepository.findAll();
        }
        return modules.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        
    }

    private ModuleResponseDTO mapToResponse(Module module) {
        ModuleResponseDTO response = new ModuleResponseDTO();
        response.setModuleId(module.getModuleId());
        response.setModuleName(module.getModuleName());
        response.setCourseName(module.getCourse().getCourseName());
        response.setCourseTypeName(module.getCourseType().getTypeName());
        response.setBatchCycleName(module.getBatchCycle().getCycleName());
        response.setStaffId(module.getStaffId());
        response.setTheoryHours(module.getTheoryHours());
        response.setPracticalHours(module.getPracticalHours());
        response.setStatus(module.getStatus());
        return response;
    }
}
