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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Subject {
	
	@Id
	@GeneratedValue(strategy =GenerationType.IDENTITY)
	private int subjectId;

	 @ManyToOne
	    @JoinColumn(name = "moduleId", nullable = false)
	    private Module module;
	
	  @Column(nullable = false)
	    private String subjectName;
	
	  @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
	    private List<Section> sections;
	
}
