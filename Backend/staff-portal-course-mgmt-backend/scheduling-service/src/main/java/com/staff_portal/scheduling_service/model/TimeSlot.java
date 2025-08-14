package com.staff_portal.scheduling_service.model;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "time_slots")

public class TimeSlot {
	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long timeSlotId;

	    @Column(name = "start_time", nullable = false)
	    private LocalTime startTime;

	    @Column(name = "end_time", nullable = false)
	    private LocalTime endTime;

	    @Column(name = "slot_name", nullable = false)
	    private String slotName;
	    
	    @OneToMany(mappedBy = "timeSlot", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<Schedule> schedules;


}
