package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.staff_portal.academic_service.dto.response.DropdownDTO;
import com.staff_portal.academic_service.repository.BatchCycleRepository;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.repository.CourseTypeRepository;
import com.staff_portal.academic_service.repository.ModuleRepository;
import com.staff_portal.academic_service.repository.SectionRepository;
import com.staff_portal.academic_service.repository.SubjectRepository;
import com.staff_portal.academic_service.repository.TopicRepository;
import com.staff_portal.academic_service.service.interfaces.DropdownService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DropdownServiceImpl implements DropdownService {

    private final BatchCycleRepository batchCycleRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final SubjectRepository subjectRepository;
    private final SectionRepository sectionRepository;
    private final TopicRepository topicRepository;
    

    @Override
    public List<DropdownDTO> getBatchCycles() {
        return batchCycleRepository.findAll().stream()
                .map(bc -> new DropdownDTO(bc.getBatchCycleId(), bc.getCycleName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DropdownDTO> getCourseTypesByBatchCycle(Integer batchCycleId) {
        return courseTypeRepository.findByBatchCycle_BatchCycleId(batchCycleId).stream()
                .map(ct -> new DropdownDTO(ct.getCourseTypeId(), ct.getTypeName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DropdownDTO> getCoursesByCourseType(Integer courseTypeId) {
        return courseRepository.findByCourseType_CourseTypeId(courseTypeId).stream()
                .map(c -> new DropdownDTO(c.getCourseId(), c.getCourseName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DropdownDTO> getModulesByCourse(Integer courseId) {
        return moduleRepository.findByCourse_CourseId(courseId).stream()
                .map(m -> new DropdownDTO(m.getModuleId(), m.getModuleName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DropdownDTO> getSubjectsByModule(Integer moduleId) {
        return subjectRepository.findByModule_ModuleId(moduleId).stream()
                .map(s -> new DropdownDTO(s.getSubjectId(), s.getSubjectName()))
                .collect(Collectors.toList());
    }
    @Override
    public List<DropdownDTO> getSectionsBySubject(Integer subjectId) {
        return sectionRepository.findBySubject_SubjectId(subjectId)
                .stream()
                .map(s -> new DropdownDTO(s.getSectionId(), s.getSectionName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DropdownDTO> getTopicsBySection(Integer sectionId) {
        return topicRepository.findBySection_SectionId(sectionId)
                .stream()
                .map(t -> new DropdownDTO(t.getTopicId(), t.getTopicName()))
                .collect(Collectors.toList());
    }
}
