package com.staff_portal.academic_service.model;

import com.staff_portal.academic_service.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
@Builder
public class Course {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "course_id", unique = true, nullable = false)
    private UUID courseId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_cycle_id", nullable = false)
    private BatchCycle batchCycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_type_id", nullable = false)
    private CourseType courseType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "premise_id", nullable = false)
    private Premise premise;

    @Column(nullable = false, unique = true)
    private String courseCode;

    @Column(nullable = false)
    private String courseName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = true)
    private LocalDate startDate;

    @Column(nullable = true)
    private LocalDate endDate;

    @Column(nullable = false, name = "student_count")
    private int studentCount;

    @Column(nullable = false, name="course_group_count")
    private int courseGroupCount;

    @Column(nullable = false)
    private boolean deleted = false;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Module> modules = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CourseGroup> courseGroups = new ArrayList<>();
}

