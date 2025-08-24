package com.staff_portal.scheduling_service.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
@NoArgsConstructor
@Entity
@Table(name = "timesheets")
public class TimeSheet {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
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
	
	@Column(name = "staff_id", nullable = false)
	private Long staffId;

	@Column(name = "log_date", nullable = false)
	private LocalDate logDate;

	@Column(name = "duration_hours")
	private int durationHours;

	@ManyToOne
    @JoinColumn(name = "course_module_id", nullable = false)
    private TimeSheetCourseModule courseModule;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "topic_id", referencedColumnName = "id")
    private TimeSheetTopic timeSheetTopic;

}