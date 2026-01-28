package com.staff_portal.user_service.dto.request;

import com.staff_portal.user_service.enums.AccessStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class StaffMenuAccessCreateRequestDTO {
    @NotNull
    private UUID staffId;

    @NotEmpty
    private List<MenuAccessItem> exceptions;

    @Data
    public static class MenuAccessItem {
        @NotNull
        private UUID menuItemId;
        @NotNull
        private AccessStatus status; // ALLOWED/BLOCKED
    }
}
