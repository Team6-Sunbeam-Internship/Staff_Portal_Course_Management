package com.staff_portal.academic_service.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class CourseType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int course_type_id;
	
	 @ManyToOne
	    @JoinColumn(name = "batch_cycle_id", nullable = false)
	    private BatchCycle batchCycle;
	
	 @ManyToOne
	    @JoinColumn(name = "premises_id", nullable = false)
	    private Premises premises;
	 
	 @Column(nullable = false)
	    private String typeName;
	 
	 @OneToMany(mappedBy = "courseType", cascade = CascadeType.ALL)
	    private List<Course> courses;

	
	
	public CourseType() {
		
	}

}
