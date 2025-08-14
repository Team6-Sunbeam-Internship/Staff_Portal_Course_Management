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
public class Student {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int  studentId;
	
	 @Column(nullable = false, unique = true)
	    private String registrationNumber;
	 
	 @Column(nullable = false)
	    private String name;
	 
	 @Column(nullable = false,unique = true)
	 private String email;
	 
	 @Column(nullable = false)
	 private String phone;
	 

	 @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
	    private List<StudentGroup> studentGroups;
	 
	public Student() {
		// TODO Auto-generated constructor stub
	}

}
