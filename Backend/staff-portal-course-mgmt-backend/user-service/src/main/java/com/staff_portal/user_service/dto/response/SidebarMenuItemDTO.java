package com.staff_portal.user_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SidebarMenuItemDTO {
    private String key;
    private String label;
    private String path;
    private String icon;
    private Boolean single;
    private List<SidebarMenuItemDTO> children;
}
