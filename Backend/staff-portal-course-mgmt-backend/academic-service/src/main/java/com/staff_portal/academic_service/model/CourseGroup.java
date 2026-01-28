package com.staff_portal.academic_service.model;

import com.staff_portal.academic_service.enums.CourseGroupStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class CourseGroup {

	@Id
	@UuidGenerator
    @GeneratedValue
    @Column(name = "course_group_id", nullable = false, updatable = false)
	private UUID groupId;

	@Column(name = "group_name", nullable = false)
	private String groupName;

	@Column(name = "description", length = 500)
	private String description;

	@Column(nullable = false)
	private Integer capacity;

	@Enumerated(EnumType.STRING)
	@Column(name = "course_group_status", nullable = false)
	private CourseGroupStatus status;
	
	@Column(name = "is_deleted", nullable = false)
	private boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

	@ManyToOne
	@JoinColumn(name = "course_type_id", nullable = false)
	private CourseType courseType;

	@ManyToOne
	@JoinColumn(name = "batchcycle_id")
	private BatchCycle batchCycle;
}
