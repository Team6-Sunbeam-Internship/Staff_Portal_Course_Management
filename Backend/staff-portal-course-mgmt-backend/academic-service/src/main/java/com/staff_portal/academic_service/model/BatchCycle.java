package com.staff_portal.academic_service.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class BatchCycle {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int batchCycleId;
	
	@Column(nullable=false,unique = true)
	private String cycleName;
	
	 @OneToMany(mappedBy = "batchCycle", cascade = CascadeType.ALL)
	    private List<CourseType> courseTypes;
	
	public BatchCycle() {
	
	}

}
