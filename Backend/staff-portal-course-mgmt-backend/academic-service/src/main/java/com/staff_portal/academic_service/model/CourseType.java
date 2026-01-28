package com.staff_portal.academic_service.model;

import com.staff_portal.academic_service.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "course_types")
@Builder
public class CourseType {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name="course_type_id",unique = true, nullable = false)
    private UUID courseTypeId;     // Id in Frontend

    @Column(name = "course_type_name", nullable = false)
    private String courseTypeName; // Title in Frontend

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private boolean deleted = false;

    @OneToMany(mappedBy = "courseType", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Course> courses = new ArrayList<>();
}
