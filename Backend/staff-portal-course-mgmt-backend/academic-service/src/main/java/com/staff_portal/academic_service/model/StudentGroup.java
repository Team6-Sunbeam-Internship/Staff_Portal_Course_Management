package com.staff_portal.academic_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"studentId", "groupId"})})
public class StudentGroup {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int studentGroupId;

	    @ManyToOne
	    @JoinColumn(name = "studentId", nullable = false)
	    private Student student;

	    @ManyToOne
	    @JoinColumn(name = "groupId", nullable = false)
	    private CourseGroup courseGroup;
	

}
