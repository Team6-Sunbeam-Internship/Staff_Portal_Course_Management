package com.staff_portal.user_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportResponseDTO {
    private int totalRecords;
    private int successfulImports;
    private int failedImports;
    private List<String> errors;
    private List<String> successfulRegistrationNumbers;
    private List<String> failedRegistrationNumbers;
    private String message;
}
