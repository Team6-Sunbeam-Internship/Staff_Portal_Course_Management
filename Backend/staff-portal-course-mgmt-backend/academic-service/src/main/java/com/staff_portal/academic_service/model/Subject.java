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
public class Subject {
	
	@Id
	@GeneratedValue(strategy =GenerationType.IDENTITY)
	private int subject_id;

	 @ManyToOne
	    @JoinColumn(name = "module_id", nullable = false)
	    private Module module;
	
	  @Column(nullable = false)
	    private String subject_name;
	
	  @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
	    private List<Section> sections;
	
	public Subject() {
		
	}

}
