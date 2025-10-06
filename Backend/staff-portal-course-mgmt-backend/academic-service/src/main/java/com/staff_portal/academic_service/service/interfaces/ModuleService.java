package com.staff_portal.academic_service.service.interfaces;


import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ModuleService {
    ApiResponse<UUID> createModule(String courseCode, ModuleRequestDTO requestDTO);
    ModuleResponseDTO updateModule(int id, ModuleRequestDTO requestDTO);
    void deleteModule(int id);
    List<ModuleResponseDTO> getAllModules();
    ModuleResponseDTO getModuleById(int id);
    
    List<ModuleResponseDTO> getModulesByFilters(Integer batchCycleId, Integer courseTypeId, Integer courseId);
}