package com.staff_portal.academic_service.model;

import com.staff_portal.academic_service.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatchCycle {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "batch_cycle_id", nullable = false, updatable = false)
    private UUID batchCycleId;

    @Column(nullable = false, unique = true, name = "batch_cycle_name")
	private String batchCycleName;

	@Column(length = 500, name = "description") 
	private String description;

	@Column(name = "start_date", nullable=false)
	private LocalDate startDate;

	@Column(name = "end_date", nullable=false)
	private LocalDate endDate;
	
	@Column(name = "is_deleted", nullable = false)
	private boolean deleted = false;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, name = "batchcycle_status",length=20)
	private Status status;

}
