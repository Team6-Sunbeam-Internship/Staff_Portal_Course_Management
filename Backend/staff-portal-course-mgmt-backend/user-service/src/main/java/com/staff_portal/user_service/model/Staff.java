package com.staff_portal.user_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.staff_portal.user_service.enums.Gender;
import com.staff_portal.user_service.enums.StaffRole;
import com.staff_portal.user_service.enums.StaffType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "staffs")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {
	@Id
	@UuidGenerator
    @GeneratedValue
	@Column(name = "staff_id", updatable = false, nullable = false, unique = true)
	private UUID staffId;

	@Column(name = "auth_user_id", nullable = false, unique = true)
	private UUID authUserId;

	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	@Column(name = "email", nullable = false, unique = true, length = 100)
	private String email;

	@Column(name = "phone", length = 20)
	private String phone;

	@Column(name = "address", length = 255)
	private String address;

    @Enumerated(EnumType.STRING)
    @Column(length = 7)
    private Gender gender;

	@Enumerated(EnumType.STRING)
	@Column(name = "staff_type", length = 50)
	private StaffType staffType;         // IN_HOUSE, VISITING

	@Enumerated(EnumType.STRING)
	@Column(name = "role", length = 50)
	private StaffRole staffRole;         // ADMIN, COURSE_COORDINATOR, GENERAL_USER

	@Column(name = "course_specialization", length = 255)
	private String courseSpecialization; // "Multiple" or "SpecificCourseName"(like PG-DAC, PG-DMC etc.)

	@Builder.Default
	@Column(nullable = false)
	@JsonProperty("is_deleted")
	private boolean isDeleted = false;

	@CreatedDate
	@Column(name = "created_at", updatable = false, nullable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	// One staff can have many menu accesses
	@OneToMany(mappedBy = "staff", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<StaffMenuAccess> menuAccesses;
}
