package com.staff_portal.academic_service.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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
@Table(name = "premises")
public class Premise {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "premise_id", unique = true, nullable = false, length = 36)
	private UUID premiseId;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "type", nullable = false)
	private String type;

	@Column(name = "address", nullable = false)
	private String address;

    @Column(name = "description")
    private String description;

	@Column(name = "is_deleted", nullable = false)
	private boolean deleted = false;

	@OneToMany(mappedBy = "premises", cascade = CascadeType.ALL)
	private List<Infrastructure> infrastructure;

	@OneToMany(mappedBy = "premises", cascade = CascadeType.ALL)
	private List<CourseType> coursetypes;
}
