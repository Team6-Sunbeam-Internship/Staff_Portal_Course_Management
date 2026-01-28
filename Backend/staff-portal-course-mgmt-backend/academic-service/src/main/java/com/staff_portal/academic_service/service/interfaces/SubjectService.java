package com.staff_portal.academic_service.service.interfaces;

import com.staff_portal.academic_service.dto.request.SubjectRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;

import java.util.UUID;

public interface SubjectService {

    ApiResponse<UUID> createSubject(UUID moduleId, SubjectRequestDTO requestDTO);

    ApiResponse<String> updateSubject(UUID subjectId, SubjectRequestDTO requestDTO);

    void deleteSubject(UUID id);
}