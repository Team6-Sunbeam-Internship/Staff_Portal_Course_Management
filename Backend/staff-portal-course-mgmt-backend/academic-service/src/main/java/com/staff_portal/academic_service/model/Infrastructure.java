package com.staff_portal.academic_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Infrastructure {

    @Id
    @GeneratedValue
    @UuidGenerator
	@Column(name = "infrastructure_id")
	private UUID infrastructureId;

	@Column(name = "room_name", nullable = false)
	private String roomName;

	@Column(name = "type", nullable = false)
	private String type;

	@Column(name = "capacity", nullable = false)
	private int capacity;

	@Column(name = "description", length = 500)
	private String description;
	
	@Column(name = "is_deleted", nullable = false)
	private boolean deleted = false;

	@ManyToOne
	@JoinColumn(name = "premises_id", nullable = false)
	private Premise premise;

}
