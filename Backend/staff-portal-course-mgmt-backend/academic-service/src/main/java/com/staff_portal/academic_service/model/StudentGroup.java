package com.staff_portal.academic_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"student_id", "group_id"})})
public class StudentGroup {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int studentGroupId;

	    @ManyToOne
	    @JoinColumn(name = "student_id", nullable = false)
	    private Student student;

	    @ManyToOne
	    @JoinColumn(name = "group_id", nullable = false)
	    private CourseGroup courseGroup;
	
	

	public StudentGroup() {
		// TODO Auto-generated constructor stub
	}

}
