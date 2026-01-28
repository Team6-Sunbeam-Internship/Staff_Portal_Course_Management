package com.staff_portal.scheduling_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;
import java.time.LocalTime;


@Getter
@ToString
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "time_slots")
@Builder
public class TimeSlot {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "time_slot_id", nullable = false)
    private UUID id;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
}
