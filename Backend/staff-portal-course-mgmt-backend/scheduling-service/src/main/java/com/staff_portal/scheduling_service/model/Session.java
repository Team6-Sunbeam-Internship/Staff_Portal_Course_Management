package com.staff_portal.scheduling_service.model;


import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.UUID;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE sessions SET is_deleted = true WHERE session_id = ?")
@FilterDef(
    name = "sessionDeletedFilter",
    parameters = @ParamDef(name = "isDeleted", type = Boolean.class)
)
@Filter(
    name = "sessionDeletedFilter",
    condition = "is_deleted = :isDeleted"
)
@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "session_id", nullable = false)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(name = "staff_name",nullable = false, length = 30)
    private String staffName;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "batch_cycle_name", nullable = false)
   	private String batchCycleName;
    
    @Column(name = "course_name", nullable = false)
   	private String courseName;

    @Column(name = "meeting_id", nullable = false, length = 20)
    private String meetingId;

    @Column(name = "meeting_credentials", nullable = false, length = 30)
    private String meetingCredentials;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SessionStatus status = SessionStatus.SCHEDULED;
    
    
    @Column(nullable = false, length = 80)
    private String description;

    @Column(name = "code_share_token", nullable = false, length = 50)
    private String codeShareToken;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;
    
    @CreatedDate
   	@Column(name = "created_at", updatable = false, nullable = false)
   	private LocalDateTime createdAt;

   	@LastModifiedDate
   	@Column(name = "updated_at", nullable = false)
   	private LocalDateTime updatedAt;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isDeleted = false;
}
