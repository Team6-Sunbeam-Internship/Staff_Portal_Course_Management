package com.staff_portal.user_service.dto.request;

import com.staff_portal.user_service.enums.StaffRole;
import com.staff_portal.user_service.enums.StaffType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffDTO {

    // Used in response only
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID staffId;

    // Used in request only
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private UUID authUserId;

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String designation;
    private StaffType staffType;
    private StaffRole staffRole;
    private String courseSpecialization;
}