package com.staff_portal.academic_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Infrastructure {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int infrastructureId;
	
	@Column(nullable=false)
	private String roomName;
	
	@ManyToOne
	@JoinColumn(name="premises_id",nullable=false)
	private Premises premises;

	
	public Infrastructure() {
			
	}
	

}
