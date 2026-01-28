package com.staff_portal.academic_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuleRouterCourseHierarchyResponse {
    private List<String> courseCodes;
    private List<ModuleHierarchyDTO> modules;
}
