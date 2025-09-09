package com.staff_portal.academic_service.service.implementation;



import com.staff_portal.academic_service.dto.request.SubjectRequestDTO;
import com.staff_portal.academic_service.dto.response.SubjectResponseDTO;

import com.staff_portal.academic_service.enums.SubjectStatus;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.model.Subject;
//import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.repository.ModuleRepository;
import com.staff_portal.academic_service.repository.SubjectRepository;
import com.staff_portal.academic_service.service.interfaces.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final ModuleRepository moduleRepository;
//    private final CourseRepository courseRepository;

    @Override
    public SubjectResponseDTO addSubject(SubjectRequestDTO requestDTO) {
        Module module = moduleRepository.findById(requestDTO.getModuleId())
                .orElseThrow(() -> new RuntimeException("Module not found"));

        Course course = module.getCourse();
        if (course == null) {
            throw new RuntimeException("Course not found for given module");
        }

        if (subjectRepository.existsBySubjectNameAndModule_ModuleId(requestDTO.getSubjectName(), requestDTO.getModuleId())) {
            throw new RuntimeException("Subject already exists for this module");
        }

        Subject subject = new Subject();
        subject.setModule(module);
        subject.setSubjectName(requestDTO.getSubjectName());
        subject.setFacultyName(requestDTO.getFacultyName());
        subject.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : SubjectStatus.ACTIVE);

        Subject saved = subjectRepository.save(subject);
        return mapToResponse(saved);
    }

    @Override
    public SubjectResponseDTO updateSubject(int id, SubjectRequestDTO requestDTO) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Module module = moduleRepository.findById(requestDTO.getModuleId())
                .orElseThrow(() -> new RuntimeException("Module not found"));

        subject.setModule(module);
        subject.setSubjectName(requestDTO.getSubjectName());
        subject.setFacultyName(requestDTO.getFacultyName());
        subject.setStatus(requestDTO.getStatus());
//        subject.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : SubjectStatus.ACTIVE);

        subjectRepository.save(subject);
        return mapToResponse(subject);
    }

    @Override
    public void deleteSubject(int id) {
        if (!subjectRepository.existsById(id)) {
            throw new RuntimeException("Subject not found");
        }
        subjectRepository.deleteById(id);
    }

    @Override
    public List<SubjectResponseDTO> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SubjectResponseDTO getSubjectById(int id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        return mapToResponse(subject);
    }
    
    @Override
    public List<SubjectResponseDTO> getSubjectsByFilters(Integer batchCycleId, Integer courseTypeId, Integer courseId, Integer moduleId) {
        List<Subject> subjects = subjectRepository
                .findByModule_ModuleIdAndModule_Course_CourseIdAndModule_CourseType_CourseTypeIdAndModule_BatchCycle_BatchCycleId(
                        moduleId, courseId, courseTypeId, batchCycleId);

        return subjects.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SubjectResponseDTO mapToResponse(Subject subject) {
        SubjectResponseDTO response = new SubjectResponseDTO();
        response.setSubjectId(subject.getSubjectId());
        response.setSubjectName(subject.getSubjectName());
        response.setFacultyName(subject.getFacultyName());
        response.setStatus(subject.getStatus());

        if (subject.getModule() != null) {
            response.setModuleName(subject.getModule().getModuleName());

            if (subject.getModule().getCourse() != null) {
                response.setCourseName(subject.getModule().getCourse().getCourseName());
            }
        }
        return response;
    }
}
