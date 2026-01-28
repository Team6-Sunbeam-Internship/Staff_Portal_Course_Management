package com.staff_portal.user_service.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class MenuItemResponseDTO {
    private UUID id;
    private String title;
    private String description;
    private String path;
    private String parentKey;
    private String fullPathKey;
}
