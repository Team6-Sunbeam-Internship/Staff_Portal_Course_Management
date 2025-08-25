package com.staff_portal.academic_service.model;

import java.time.LocalDate;
import java.util.List;

import com.staff_portal.academic_service.enums.BatchStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class BatchCycle {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "batchcycle_id")
	private int batchCycleId;
	
	@Column(nullable=false,unique = true,name="cycle_name")
	private String cycleName;
	
	 @Column(length = 500,name="description")   // optional: limit description length
	    private String description;

	    @Column(nullable = true,name="start_date")
	    private LocalDate startDate;

	    @Column(nullable = true,name="end_date")
	    private LocalDate endDate;
	
	 @OneToMany(mappedBy = "batchCycle", cascade = CascadeType.ALL)
	    private List<CourseType> courseTypes;
	 
	 @Enumerated(EnumType.STRING)
	 @Column(nullable = false,name="batchcycle_status")
	 private BatchStatus status;
	
	
}
