package com.staff_portal.academic_service.model;

import java.util.List;
import java.util.UUID;

import com.staff_portal.academic_service.enums.CourseTypeStatus;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

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
    @Column(name="course_type_id",unique = true, nullable = false, length = 36)
    private UUID courseTypeId;

    @Column(nullable = false)
    private String typeName;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseTypeStatus status;

    @Column(nullable = false)
    private boolean deleted = false;

    @OneToMany(mappedBy = "courseType", cascade = CascadeType.ALL)
    private List<Course> courses;

}
