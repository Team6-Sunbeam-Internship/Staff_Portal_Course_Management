package com.staff_portal.scheduling_service.dto.request;



import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
@NoArgsConstructor
public class TimeSheetCourseModuleRequestDTO {

	@NotNull(message = "Course ID must not be null")
    private String courseName;

    @NotNull(message = "Module ID must not be null")
    private String moduleName;
}

