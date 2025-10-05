package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;
import com.staff_portal.academic_service.enums.ModuleStatus;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseType;
import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.model.Subject;
import com.staff_portal.academic_service.model.Section;
import com.staff_portal.academic_service.model.Topic;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.repository.CourseTypeRepository;
import com.staff_portal.academic_service.repository.ModuleRepository;
import com.staff_portal.academic_service.service.interfaces.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;
    

    @Override
    public ModuleResponseDTO addModule(ModuleRequestDTO requestDTO) {
        Course course = courseRepository.findById(requestDTO.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseType courseType = courseTypeRepository.findById(requestDTO.getCourseTypeId())
                .orElseThrow(() -> new RuntimeException("CourseType not found"));

        if (moduleRepository.existsByModuleNameAndCourse_CourseId(requestDTO.getModuleName(), requestDTO.getCourseId())) {
            throw new RuntimeException("Module already exists for this course");
        }

        Module module = new Module();
        module.setModuleName(requestDTO.getModuleName());
        module.setCourse(course);
        module.setCourseType(courseType); // ⚠️ important
        module.setTheoryHours(requestDTO.getTheoryHours());
        module.setPracticalHours(requestDTO.getPracticalHours());
        module.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : ModuleStatus.ACTIVE);
        module.setDeleted(false);

        Module saved = moduleRepository.save(module);
        return mapToResponse(saved);
    }

    // Update Module
    @Override
    public ModuleResponseDTO updateModule(int id, ModuleRequestDTO requestDTO) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        module.setModuleName(requestDTO.getModuleName());
        module.setTheoryHours(requestDTO.getTheoryHours());
        module.setPracticalHours(requestDTO.getPracticalHours());
        module.setStatus(requestDTO.getStatus());

        moduleRepository.save(module);
        return mapToResponse(module);
    }

    // Soft Delete Module + cascading subjects → sections → topics
    @Override
    @Transactional
    public void deleteModule(int id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        module.setDeleted(true);

        if (module.getSubjects() != null) {
            for (Subject subject : module.getSubjects()) {
                subject.setDeleted(true);
                if (subject.getSections() != null) {
                    for (Section section : subject.getSections()) {
                        section.setDeleted(true);
                        if (section.getTopics() != null) {
                            for (Topic topic : section.getTopics()) {
                                topic.setDeleted(true);
                            }
                        }
                    }
                }
            }
        }

        moduleRepository.save(module); // save the changes
    }

    // Get all modules (only active)
    @Override
    public List<ModuleResponseDTO> getAllModules() {
        return moduleRepository.findByDeletedFalse().stream() // fetch active only
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get module by ID (only active)
    @Override
    public ModuleResponseDTO getModuleById(int id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        if (module.isDeleted()) throw new RuntimeException("Module not found");
        return mapToResponse(module);
    }

    // Get modules by filters (active only)
    @Override
    public List<ModuleResponseDTO> getModulesByFilters(Integer batchCycleId, Integer courseTypeId, Integer courseId) {
        List<Module> modules = moduleRepository
                .findByCourse_BatchCycle_BatchCycleIdAndCourse_CourseType_CourseTypeIdAndCourse_CourseIdAndDeletedFalse(
                        batchCycleId, courseTypeId, courseId
                );
        return modules.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Mapper
    private ModuleResponseDTO mapToResponse(Module module) {
        ModuleResponseDTO response = new ModuleResponseDTO();
        response.setModuleId(module.getModuleId());
        response.setModuleName(module.getModuleName());
        response.setCourseName(module.getCourse().getCourseName());
        response.setCourseTypeName(module.getCourseType().getTypeName());
        response.setBatchCycleName(module.getCourse().getBatchCycle().getCycleName());
        response.setTheoryHours(module.getTheoryHours());
        response.setPracticalHours(module.getPracticalHours());
        response.setStatus(module.getStatus());
        response.setDeleted(module.isDeleted());
        return response;
    }
}
