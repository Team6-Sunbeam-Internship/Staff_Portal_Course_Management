package com.staff_portal.academic_service.model;

import com.staff_portal.academic_service.enums.SectionStatus;
import com.staff_portal.academic_service.enums.TopicStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"sectionId", "topicName"})})
public class Topic {
	
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private int  topicId;
	
	 @ManyToOne
	    @JoinColumn(name = "sectionId", nullable = false)
	    private Section section;
	 
	 
	 @Column(nullable = false)
	    private String topicName;

	 @Enumerated(EnumType.STRING)
	    private TopicStatus status;

}
