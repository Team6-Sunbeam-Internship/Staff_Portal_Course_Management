package com.staff_portal.user_service.model;

import com.staff_portal.user_service.enums.AccessStatus;

import com.staff_portal.user_service.enums.StaffRole;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;

import java.util.UUID;

@Entity
@Table(name = "role_menu_access", uniqueConstraints = @UniqueConstraint(columnNames = { "role", "menu_item_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleMenuAccess {
	@Id
	@UuidGenerator
	@Column(name = "access_id")
	private UUID accessId;

    @Enumerated(EnumType.STRING)
	@Column(name = "role", nullable = false, length = 20)
	private StaffRole role; // e.g., ADMIN, COURSE_COORDINATOR, GENERAL_USER

	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "menu_item_id", nullable = false)
	private MenuItem menuItem;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private AccessStatus status; // ALLOWED, BLOCKED
}
