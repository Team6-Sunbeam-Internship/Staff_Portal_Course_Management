package com.staff_portal.academic_service.model;

import java.util.List;

import com.staff_portal.academic_service.enums.CourseGroupStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"courseId", "groupName"})})
public class CourseGroup {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int groupId;
	
	 @ManyToOne
	    @JoinColumn(name = "course_id", nullable = false)
	    private Course course;
	 
	 @Column(name="group_name",nullable = false)
	    private String groupName;
	 
	 @Column(name="description",length = 500) 
	 private String description;
	 
	 @Column(nullable = false)
	 private Integer capacity;
	 
	 @Enumerated(EnumType.STRING)
	 @Column(name="coursegroup_status",nullable = false)
	 private CourseGroupStatus status;
	 
	 @ManyToOne
	 @JoinColumn(name = "course_type_id", nullable = false)
	 private CourseType courseType;
	 
	 @ManyToOne
	    @JoinColumn(name = "batchcycle_id")  
	    private BatchCycle batchCycle;
	 
	 @OneToMany(mappedBy = "courseGroup", cascade = CascadeType.ALL)
	    private List<StudentGroup> studentGroups;
	

	
}
