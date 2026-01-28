package com.staff_portal.scheduling_service.model;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE schedules_table SET is_deleted = true WHERE schedule_id = ?")
@FilterDef(
		name = "deletedFilter",
		parameters = @ParamDef(name = "isDeleted", type = Boolean.class)
		)
@Filter(
		name = "deletedFilter",
		condition = "is_deleted = :isDeleted"
		)
@Getter
@ToString
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "schedules_table")
public class Schedule {
    @Id
    @GeneratedValue
    @UuidGenerator
	@Column(name = "schedule_id", nullable = false) 
	private UUID id;

	@Column(name = "schedule_date", nullable = false)
	private LocalDate scheduleDate;

	@Column(name = "activity", nullable = false)
	private String activity;

	@ElementCollection
	@CollectionTable(
			name = "schedule_staffnames",
			joinColumns = @JoinColumn(name = "schedule_id")
			)
	@Column(name = "staff_id",nullable = false)
	private List<UUID> staffs;


	@ElementCollection
	@CollectionTable(
			name = "schedule_studentgroups",
			joinColumns = @JoinColumn(name = "schedule_id")
			)
	@Column(name = "student_groups_id",nullable = false)
	private List<UUID> studentsGroups;


	@Column(name = "course_code", nullable = false)
	private String courseCode;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "timeslot_id", nullable = false)
	private TimeSlot timeSlot;

	@Column(name = "module_id", nullable = false)
	private UUID module;

	@Column(name = "infrastructure_id", nullable = false)
	private UUID venue;

	@CreatedDate
	@Column(name = "created_at", updatable = false, nullable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@Builder.Default
	@Column(nullable = false)
	private Boolean isDeleted = false;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;
}