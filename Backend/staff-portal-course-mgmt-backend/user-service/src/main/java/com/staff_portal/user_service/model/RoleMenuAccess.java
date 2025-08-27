package com.staff_portal.user_service.model;

import com.staff_portal.user_service.enums.AccessStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role_menu_access", uniqueConstraints = @UniqueConstraint(columnNames = { "role_name", "menu_item_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleMenuAccess {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "access_id")
	private Long accessId;

	@Column(name = "role_name", nullable = false, length = 100)
	private String roleName; // e.g., Admin, CourseCoordinator, GeneralUser

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "menu_item_id", nullable = false)
	private MenuItem menuItem;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private AccessStatus status;
}
