package com.staff_portal.academic_service.service.interfaces;
import com.staff_portal.academic_service.dto.request.SectionRequestDTO;
import com.staff_portal.academic_service.dto.response.SectionResponseDTO;

import java.util.List;

public interface SectionService {

    SectionResponseDTO addSection(SectionRequestDTO requestDTO);

    SectionResponseDTO updateSection(int id, SectionRequestDTO requestDTO);

    void deleteSection(int id);

    List<SectionResponseDTO> getAllSections();

    SectionResponseDTO getSectionById(int id);
    
    List<SectionResponseDTO> filterSections(
            Integer batchCycleId,
            Integer courseTypeId,
            Integer courseId,
            Integer moduleId,
            Integer subjectId
    );
}

