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

@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE recorded_sessions SET is_deleted = true WHERE id = ?")
@FilterDef(
        name = "recordedSessionDeletedFilter",
        parameters = @ParamDef(name = "isDeleted", type = Boolean.class)
)
@Filter(
        name = "recordedSessionDeletedFilter",
        condition = "is_deleted = :isDeleted"
)
@Getter
@ToString
@Setter
@Entity
@Table(name = "recorded_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordedSession {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private LocalDate sessionDate;

    @Column(nullable = false, length = 30)
    private String channel;

    @Column(nullable = false, length = 30)
    private String title;

    @Column(length = 500, nullable = false)
    private String description;

    @Column(nullable = false)
    private String url;

    @Column(name = "course_name", nullable = false, length = 30)
    private String courseName;

    @Column(name = "batch_cycle_name", nullable = false, length = 30)
    private String batchCycleName;

    @Column(name = "staff_name", nullable = false, length = 30)
    private String staffName;


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
