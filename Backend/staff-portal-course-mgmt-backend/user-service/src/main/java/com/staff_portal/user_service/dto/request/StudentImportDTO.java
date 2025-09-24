package com.staff_portal.user_service.dto.request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentImportDTO {
	private String registrationNumber;
    private String studentName;
    private String email;
    private String mobileNumber;
    private String address;
    private String batchCycleName;
    private String courseName;
}
