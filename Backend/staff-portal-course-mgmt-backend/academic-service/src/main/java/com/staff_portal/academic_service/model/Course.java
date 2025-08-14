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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
public class Course {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int courseId;
	
	@ManyToOne
    @JoinColumn(name = "courseTypeId", nullable = false)
    private CourseType courseType;
	
	 @Column(nullable = false, unique = true)
	    private String courseCode;
	 
	 @Column(nullable = false)
	    private String courseName;
	 
	 
	 @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
	    private List<Module> modules;

	    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
	    private List<CourseGroup> courseGroups;
	

}
