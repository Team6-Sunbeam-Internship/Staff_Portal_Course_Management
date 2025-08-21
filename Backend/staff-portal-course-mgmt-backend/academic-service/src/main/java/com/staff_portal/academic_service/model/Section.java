package com.staff_portal.academic_service.model;

import java.util.List;

import com.staff_portal.academic_service.enums.SectionStatus;
import com.staff_portal.academic_service.enums.SubjectStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"subjectId", "sectionName"})})
public class Section {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sectionId;
	
	 @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "subjectId", nullable = false)
	    private Subject subject;

	 @Column(nullable = false)
	    private String sectionName;
	 
	 @Enumerated(EnumType.STRING)
	    private SectionStatus status; 
	 
	 
	 @OneToMany(mappedBy = "section", cascade = CascadeType.ALL,orphanRemoval = true)
	    private List<Topic> topics;


}

