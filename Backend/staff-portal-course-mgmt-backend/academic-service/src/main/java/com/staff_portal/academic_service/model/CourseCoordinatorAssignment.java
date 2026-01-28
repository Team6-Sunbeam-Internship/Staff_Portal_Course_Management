package com.staff_portal.academic_service.model;

import com.staff_portal.academic_service.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(
        name = "course_coordinator_assignment",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"assigned_course"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseCoordinatorAssignment {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "assignment_id", updatable = false, nullable = false, unique = true)
    private UUID assignmentId;

    @Column(name = "staff_id", nullable = false)
    private UUID staffId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_course", nullable = false)
    private Course assignCourse;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    private Status courseAssignStatus;
}
