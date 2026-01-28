package com.staff_portal.academic_service.service.interfaces;
import com.staff_portal.academic_service.dto.request.SectionRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;

import java.util.UUID;

public interface SectionService {

    ApiResponse<UUID> createSection(UUID subjectId, SectionRequestDTO requestDTO);

    ApiResponse<String> updateSection(UUID sectionId, SectionRequestDTO requestDTO);

    void deleteSection(UUID sectionId);
}

