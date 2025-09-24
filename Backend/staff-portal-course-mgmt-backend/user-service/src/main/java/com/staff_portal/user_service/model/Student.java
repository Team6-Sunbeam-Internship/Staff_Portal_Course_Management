package com.staff_portal.user_service.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.staff_portal.user_service.enums.StudentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "student")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties({ "deleted" })
public class Student {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID studentId;

	@Column(nullable = false, unique = true, columnDefinition = "TEXT")
	private String registrationNumber;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String studentName;

	@Column(nullable = false, unique = true, columnDefinition = "TEXT")
	private String email;

	@Column(nullable = false, unique = true, columnDefinition = "TEXT")
	private String mobileNumber;

	@Column(columnDefinition = "TEXT")
	private String address;
	
	@Column(nullable = false, columnDefinition = "TEXT")
    private String batchCycleName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String courseName;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private StudentStatus status;

	@Builder.Default
	@Column(nullable = false)
	@JsonProperty("isDeleted")
	private boolean isDeleted = false;

}
