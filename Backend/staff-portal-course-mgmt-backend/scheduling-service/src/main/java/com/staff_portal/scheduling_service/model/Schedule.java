package com.staff_portal.scheduling_service.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.ParamDef;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "schedule_id", nullable = false) 
	private Long id;


	@Column(name = "schedule_date", nullable = false)
	private LocalDate scheduleDate;

	@Column(name = "activity", nullable = false)
	private String activity;

	@ElementCollection
	@CollectionTable(
			name = "schedule_staffnames",
			joinColumns = @JoinColumn(name = "schedule_id")
			)
	@Column(name = "staff_name",nullable = false)
	private List<String> staffNames;


	@ElementCollection
	@CollectionTable(
			name = "schedule_studentgroups",
			joinColumns = @JoinColumn(name = "schedule_id")
			)
	@Column(name = "student_group",nullable = false)
	private List<String> studentGroups;


	@Column(name = "course_name", nullable = false)
	private String courseName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "timeslot_id", nullable = false)
	private TimeSlot timeSlot;

	@Column(name = "module_name", nullable = false)
	private String moduleName;

	@Column(name = "infrastructure_name", nullable = false)
	private String infrastructureName;

	@Column(name = "batch_cycle_name", nullable = false)
	private String batchCycleName;

	@CreatedDate
	@Column(name = "created_at", updatable = false, nullable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@Builder.Default
	@Column(nullable = false)
	private Boolean isDeleted = false;

}