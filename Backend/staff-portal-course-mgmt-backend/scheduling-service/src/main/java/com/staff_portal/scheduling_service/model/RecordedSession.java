package com.staff_portal.scheduling_service.model;

import lombok.*;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.SQLDelete;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
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
