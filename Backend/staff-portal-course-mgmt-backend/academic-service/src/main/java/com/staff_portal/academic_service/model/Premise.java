package com.staff_portal.academic_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "premises")
@Builder
public class Premise {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "premise_id", unique = true, nullable = false)
	private UUID premiseId;

	@Column(name = "premise_name", nullable = false)
	private String premiseName;

	@Column(name = "type", nullable = false)
	private String type;

    @Embedded
	private Address address;

    @Column(name = "description")
    private String description;

	@Column(name = "is_deleted", nullable = false)
	private boolean deleted = false;

	@OneToMany(mappedBy = "premise", cascade = CascadeType.ALL)
    @Builder.Default
	private List<Infrastructure> infrastructure = new ArrayList<>();

//	@OneToMany(mappedBy = "premises", cascade = CascadeType.ALL)
//    @Builder.Default
//	private List<CourseType> courseTypes = new ArrayList<>();
}
