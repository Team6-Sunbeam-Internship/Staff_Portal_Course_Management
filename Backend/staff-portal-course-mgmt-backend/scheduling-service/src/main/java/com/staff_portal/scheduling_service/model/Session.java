package com.staff_portal.scheduling_service.model;



import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Session {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "staff_id",nullable = false)
    private Long staffId;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "meeting_id", nullable = true)
    private String meetingId;

    @Column(name = "meeting_credentials", nullable = true)
    private String meetingCredentials;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    @Column(nullable = true)
    private String description;

    @Column(name = "code_share_token", nullable = true)
    private String codeShareToken;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;
}
