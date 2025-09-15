package com.staff_portal.academic_service.model;

import java.util.List;

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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int subjectId;   // S.No in UI

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moduleId", nullable = false)
    private Module module;   // Each subject belongs to one module

    @Column(nullable = false)
    private String subjectName;   // Title in UI

//    private String facultyName;   // Faculty in UI (later can be linked to Staff entity)

    @Enumerated(EnumType.STRING)
    private SubjectStatus status;   // ACTIVE / INACTIVE
    
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<Section> sections;
}

