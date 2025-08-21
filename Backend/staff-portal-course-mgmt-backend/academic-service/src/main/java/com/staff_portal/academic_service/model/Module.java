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
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"course_id", "module_name"})})
public class Module {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int moduleId;
	
	 @ManyToOne
	    @JoinColumn(name = "courseId", nullable = false)
	    private Course course;
 
	 @Column(name = "staffId", nullable = false)
	    private int staffId; 
	 
	 @Column(nullable = false)
	    private String moduleName;
	
	 @Column(columnDefinition = "TEXT")
	    private String description;
	 
	 @Column(nullable=false)
	 private int theoryHours;
	 
	 @Column(nullable=false)
	    private Integer practicalHours;
	 
	 @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
	    private List<Subject> subjects;

}
