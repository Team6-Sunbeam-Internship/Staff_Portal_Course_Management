package com.staff_portal.user_service.model;

import com.staff_portal.user_service.enums.AccessStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff_menu_access", uniqueConstraints = @UniqueConstraint(columnNames = { "staff_id", "menu_item_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffMenuAccess {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "staff_access_id")
	private Long staffAccessId;

	@Column(name = "staff_id", nullable = false)
	private String staffId; // User's unique ID from User table

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "menu_item_id", nullable = false)
	private MenuItem menuItem;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private AccessStatus status;  
}
