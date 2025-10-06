package com.staff_portal.academic_service.service.interfaces;


import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ModuleService {
    ApiResponse<UUID> createModule(String courseCode, ModuleRequestDTO requestDTO);
    ApiResponse<String> updateModule(String courseCode, UUID moduleId, ModuleRequestDTO requestDTO);
    void deleteModule(String courseCode, UUID moduleId);
    List<ModuleResponseDTO> getAllModules();
    ModuleResponseDTO getModuleById(int id);
    
    List<ModuleResponseDTO> getModulesByFilters(Integer batchCycleId, Integer courseTypeId, Integer courseId);
}