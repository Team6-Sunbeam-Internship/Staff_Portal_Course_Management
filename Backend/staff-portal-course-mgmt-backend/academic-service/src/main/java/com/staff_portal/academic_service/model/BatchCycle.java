package com.staff_portal.academic_service.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
	private int batchCycleId;
	
	@Column(nullable=false,unique = true)
	private String cycleName;
	
	 @Column(length = 500)   // optional: limit description length
	    private String description;

	    @Column(nullable = true)
	    private LocalDate startDate;

	    @Column(nullable = true)
	    private LocalDate endDate;
	
	 @OneToMany(mappedBy = "batchCycle", cascade = CascadeType.ALL)
	    private List<CourseType> courseTypes;
	 
	
	
}
