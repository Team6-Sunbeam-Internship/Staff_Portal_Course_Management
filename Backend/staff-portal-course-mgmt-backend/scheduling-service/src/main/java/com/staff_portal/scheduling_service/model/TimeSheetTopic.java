package com.staff_portal.scheduling_service.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Getter
@ToString
@Setter
@NoArgsConstructor
@Entity
@Table(name = "timesheet_topics")
public class TimeSheetTopic {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false)
    private UUID id;

    @Column(name = "topic_name", nullable = false)
    private String topicName;

    @ManyToOne
    @JoinColumn(name = "timesheet_id", nullable = false)
    private TimeSheet timeSheet;

}