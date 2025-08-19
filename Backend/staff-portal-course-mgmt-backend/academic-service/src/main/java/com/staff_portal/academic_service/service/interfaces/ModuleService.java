package com.staff_portal.academic_service.service.interfaces;


import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;

import java.util.List;

public interface ModuleService {
    ModuleResponseDTO addModule(ModuleRequestDTO requestDTO);
    ModuleResponseDTO updateModule(int id, ModuleRequestDTO requestDTO);
    void deleteModule(int id);
    List<ModuleResponseDTO> getAllModules();
    ModuleResponseDTO getModuleById(int id);
}