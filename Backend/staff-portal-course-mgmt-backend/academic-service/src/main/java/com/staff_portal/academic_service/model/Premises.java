package com.staff_portal.academic_service.model;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import com.staff_portal.academic_service.enums.PremisesStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
public class Premises {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int premisesId;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "type", nullable = false)
	private String type;

	@Column(name = "address", nullable = false)
	private String address;

	@Column(name = "city", nullable = false)
	private String city;

	@Column(name = "state", nullable = false)
	private String state;

	@Column(name = "postal_code") 
	private String postalCode;

	@Enumerated(EnumType.STRING)
	@Column(name = "premises_status", nullable = false)
	private PremisesStatus status;

	@Column(name = "is_deleted", nullable = false)
	private boolean deleted = false;

	@OneToMany(mappedBy = "premises", cascade = CascadeType.ALL)
	private List<Infrastructure> infrastructure;

	@OneToMany(mappedBy = "premises", cascade = CascadeType.ALL)
	private List<CourseType> coursetypes;

}
