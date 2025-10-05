package com.staff_portal.academic_service.model;

import com.staff_portal.academic_service.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(
        name = "course_coordinator_assignment",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"course_code", "premise_id"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseCoordinatorAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "assignment_id", updatable = false, nullable = false, unique = true)
    private UUID assignmentId;

   
    @Column(name = "staff_id", nullable = false)
    private UUID staffId;

    
    @Column(name = "course_code", nullable = false, length = 50)
    private String courseCode;

    @Column(name = "course_name", nullable = false, length = 50)
    private String courseName;
    
    @Column(name = "premise_id", nullable = false)
    private UUID premiseId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    private Status courseAssignStatus;
}
