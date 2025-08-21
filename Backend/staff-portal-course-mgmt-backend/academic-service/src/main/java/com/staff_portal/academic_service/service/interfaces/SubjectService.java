package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.SubjectRequestDTO;
import com.staff_portal.academic_service.dto.response.SubjectResponseDTO;

public interface SubjectService {

    SubjectResponseDTO addSubject(SubjectRequestDTO requestDTO);

    SubjectResponseDTO updateSubject(int id, SubjectRequestDTO requestDTO);

    void deleteSubject(int id);

    List<SubjectResponseDTO> getAllSubjects();

    SubjectResponseDTO getSubjectById(int id);
}