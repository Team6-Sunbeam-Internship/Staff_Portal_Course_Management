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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"course_id", "group_name"})})
public class CourseGroup {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int groupId;
	
	 @ManyToOne
	    @JoinColumn(name = "course_id", nullable = false)
	    private Course course;
	 
	 @Column(nullable = false)
	    private String groupName;
	 
	 @Column(nullable = false)
	 private Integer capacity;
	 
	 @OneToMany(mappedBy = "courseGroup", cascade = CascadeType.ALL)
	    private List<StudentGroup> studentGroups;
	

	public CourseGroup() {
		
	}

}
