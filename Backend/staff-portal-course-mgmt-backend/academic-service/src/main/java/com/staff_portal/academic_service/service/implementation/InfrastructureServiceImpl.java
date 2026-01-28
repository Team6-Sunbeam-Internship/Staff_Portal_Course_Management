package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.InfrastructureRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.InfrastructureResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.model.Infrastructure;
import com.staff_portal.academic_service.model.Premise;
import com.staff_portal.academic_service.repository.InfrastructureRepository;
import com.staff_portal.academic_service.repository.PremiseRepository;
import com.staff_portal.academic_service.service.interfaces.InfrastructureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InfrastructureServiceImpl implements InfrastructureService {

    private final InfrastructureRepository infrastructureRepository;
    private final PremiseRepository premiseRepository;

    @Override
    public ApiResponse<UUID> createInfrastructure(InfrastructureRequest request) {
        Premise premise = premiseRepository.findById(request.getPremiseId()).orElseThrow(
                () -> new ResourceNotFoundException("Premises not found with id: " + request.getPremiseId()));

        Infrastructure infrastructure = Infrastructure.builder()
                .roomName(request.getTitle())
                .type(request.getType())
                .description(request.getDescription())
                .capacity(request.getCapacity())
                .premise(premise)
                .build();

        Infrastructure saved = infrastructureRepository.save(infrastructure);

        return ApiResponse.onSuccess(saved.getInfrastructureId());
    }

    @Override
    public ApiResponse<String> updateInfrastructure(UUID id, InfrastructureRequest request) {

        Infrastructure infra = infrastructureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Infrastructure not found with id: " + id));

        Premise premise = premiseRepository.findById(request.getPremiseId()).orElseThrow(
                () -> new ResourceNotFoundException("Premises not found with id: " + request.getPremiseId()));

        infra.setRoomName(request.getTitle());
        infra.setType(request.getType());
        infra.setCapacity(request.getCapacity());
        infra.setDescription(request.getDescription());
        infra.setPremise(premise);

        infrastructureRepository.save(infra);

        return ApiResponse.onSuccess(String.format("Successfully updated infrastructure with id %s", infra.getInfrastructureId()));
    }

    @Override
    public void deleteInfrastructure(UUID id) {
        Infrastructure infra = infrastructureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Infrastructure not found with id: " + id));

        infra.setDeleted(true);
        infrastructureRepository.save(infra);

    }

    @Override
    public ApiResponse<List<InfrastructureResponse>> getAllInfrastructures() {
        List<InfrastructureResponse> listOfPremises = infrastructureRepository.findAll().stream()
                .filter(infra -> !infra.isDeleted())
                .map(filteredInfrastructure -> InfrastructureResponse.builder()
                        .id(filteredInfrastructure.getInfrastructureId())
                        .title(filteredInfrastructure.getRoomName())
                        .type(filteredInfrastructure.getType())
                        .description(filteredInfrastructure.getDescription())
                        .premisesId(filteredInfrastructure.getPremise().getPremiseId())
                        .premisesTitle(filteredInfrastructure.getPremise().getPremiseName())
                        .capacity(filteredInfrastructure.getCapacity())
                        .build()).toList();
        return ApiResponse.onSuccess(listOfPremises);
    }

}
