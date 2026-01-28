package com.staff_portal.user_service.model;

import com.staff_portal.user_service.enums.AccessStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "staff_menu_access", uniqueConstraints = @UniqueConstraint(columnNames = { "staff_id", "menu_item_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffMenuAccess {
	@Id
	@UuidGenerator
	@Column(name = "staff_access_id", updatable = false, nullable = false, unique = true)
	private UUID staffAccessId;
	
//	 Many accesses belong to one staff
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

//    Many accesses belong to one menu item
	@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "menu_item_id", nullable = false)
	private MenuItem menuItem;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private AccessStatus status;  
}
