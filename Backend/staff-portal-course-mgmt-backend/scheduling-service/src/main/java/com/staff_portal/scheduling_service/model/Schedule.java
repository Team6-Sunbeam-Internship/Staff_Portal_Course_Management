package com.staff_portal.scheduling_service.model;


import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
@NoArgsConstructor
@Entity
@Table(name = "schedules")
public class Schedule {
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "schedule_id", nullable = false) 
	private Long id;
     
         
	@Column(name = "schedule_date", nullable = false)
    private LocalDate scheduleDate;
	
	 @Column(name = "activity", nullable = false)
	 private String activity;
    
    @Column(name = "staff_id", nullable = false)
    private Long staffId;
   
   	@JoinColumn(name = "course_id", nullable = true)
   	private Long courseId;
    
   	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timeslot_id", nullable = false)
    private TimeSlot timeSlot;
    
   	@Column(name = "module_id", nullable = true)
   	private Long moduleId;
    
   	@Column(name = "infrastructure_id", nullable = true)
   	private Long infrastructureId;
    
    
}