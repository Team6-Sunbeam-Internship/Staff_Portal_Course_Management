package com.staff_portal.user_service.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.staff_portal.user_service.enums.StudentStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {

    private String registrationNumber;
    private String studentName;
    private String email;
    private String mobileNumber;
    private String address;
    private String batchCycleName;
    private String courseName;
    private StudentStatus status;

    // visible in response only
    @JsonProperty(access = JsonProperty.Access.READ_ONLY) 
    private boolean isDeleted;
}
