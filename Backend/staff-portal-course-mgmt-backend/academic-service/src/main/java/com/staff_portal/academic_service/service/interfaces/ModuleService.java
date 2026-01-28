package com.staff_portal.academic_service.service.interfaces;


import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public interface ModuleService {
    ApiResponse<UUID> createModule(String courseCode, ModuleRequestDTO requestDTO);
    ApiResponse<String> updateModule(UUID moduleId, ModuleRequestDTO requestDTO);

    // Soft Delete Module + cascading subjects → sections → topics
    @Transactional
    void deleteModule(UUID moduleId);
}