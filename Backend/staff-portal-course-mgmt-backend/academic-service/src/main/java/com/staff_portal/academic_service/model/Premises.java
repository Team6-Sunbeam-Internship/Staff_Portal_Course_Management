package com.staff_portal.academic_service.model;

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
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Premises {

	@Id
	@GeneratedValue(strategy =GenerationType.IDENTITY)
	private int premisesId;
	
	@Column(nullable = false)
	private String name;
	
	@Column(nullable = false)
	private String address;
	
	@Column(nullable = false)
	private String city;
	
	@Column(nullable = false)
	private String state;
	
	
	@OneToMany(mappedBy = "premises", cascade = CascadeType.ALL)
	private List<Infrastructure> infrastructure;
	
	@OneToMany(mappedBy = "premises", cascade = CascadeType.ALL)
	private List<CourseType> coursetypes;
	
	@Override
	public String toString() {
		
		return "Premise [Id="+ premisesId +",Premises name="+ name +",Premises address="+address+",City="+city+",State="+state+"]" ;
	}
	
}
