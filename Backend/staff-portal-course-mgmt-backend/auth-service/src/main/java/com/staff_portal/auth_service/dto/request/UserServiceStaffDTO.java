package com.staff_portal.auth_service.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
//@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class UserServiceStaffDTO extends BaseStaffDTO {
    
    public static UserServiceStaffDTO fromAuthUserRequest(AuthUserRequestDTO request) {
        return UserServiceStaffDTO.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .role(request.getRole())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .gender(request.getGender())
                .staffType(request.getStaffType())
                .courseSpecialization(request.getCourseSpecialization())
                .authUserId(request.getAuthUserId())
                .build();
    }
}