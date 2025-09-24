package com.staff_portal.scheduling_service.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.SQLDelete;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE timesheets SET is_deleted = true WHERE id = ?")
@FilterDef(
    name = "timesheetDeletedFilter",
    parameters = @ParamDef(name = "isDeleted", type = Boolean.class)
)
@Filter(
    name = "timesheetDeletedFilter",
    condition = "is_deleted = :isDeleted"
)
@Getter
@ToString
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "timesheets")
public class TimeSheet {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false)
	private Long id;

	@Column(name = "start_time", nullable = false)
	private LocalTime startTime;

	@Column(name = "end_time", nullable = false)
	private LocalTime endTime;

	@Column(name = "extra_topic")
	private String extraTopic;

	private String assignment;
	
	@Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TimeSheetStatus status;
	
	@Column(name = "staff_name", nullable = false)
	private String staffName;

	@Column(name = "log_date", nullable = false)
	private LocalDate logDate;

	@Column(name = "duration_hours", nullable = false)
	private int durationHours;

	@ManyToOne
	@JoinColumn(name = "course_module_id", nullable = false)
	private TimeSheetCourseModule courseModule;

	@OneToMany(mappedBy = "timeSheet", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<TimeSheetTopic> timeSheetTopics = new ArrayList<>();
	
	@CreatedDate
   	@Column(name = "created_at", updatable = false, nullable = false)
   	private LocalDateTime createdAt;

   	@LastModifiedDate
   	@Column(name = "updated_at", nullable = false)
   	private LocalDateTime updatedAt;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isDeleted = false;
    
    @Column(name = "batch_cycle_name", nullable = false)
   	private String batchCycleName;
	
}