package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import java.util.UUID;

import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.model.Premise;
import com.staff_portal.academic_service.repository.PremiseRepository;
import org.springframework.stereotype.Service;
import com.staff_portal.academic_service.dto.request.InfrastructureRequest;
import com.staff_portal.academic_service.dto.response.InfrastructureResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.model.Infrastructure;
import com.staff_portal.academic_service.repository.InfrastructureRepository;
import com.staff_portal.academic_service.service.interfaces.InfrastructureService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InfrastructureServiceImpl implements InfrastructureService {

    private final InfrastructureRepository infrastructureRepository;
    private final PremiseRepository premiseRepository;

    @Override
    public ApiResponse<UUID> createInfrastructure(InfrastructureRequest request) {
        UUID premiseId = UUID.fromString(request.getPremiseId());
        Premise premise = premiseRepository.findById(premiseId).orElseThrow(
                () -> new ResourceNotFoundException("Premises not found with id: " + request.getPremisesId()));

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
    public InfrastructureResponse getInfrastructureById(int id) {
        Infrastructure infra = infrastructureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Infrastructure not found with id: " + id));

        return new InfrastructureResponse(infra.getInfrastructureId(), infra.getRoomName(), infra.getType(),
                infra.getLocation(), infra.getCapacity(), infra.getDescription(), infra.getPremises().getPremisesId(),
                infra.getPremises().getName());
    }

    @Override
    public InfrastructureResponse updateInfrastructure(int id, InfrastructureRequest request) {

        Infrastructure infra = infrastructureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Infrastructure not found with id: " + id));

        Premises premises = premisesRepository.findById(request.getPremisesId()).orElseThrow(
                () -> new ResourceNotFoundException("Premises not found with id: " + request.getPremisesId()));

        infra.setRoomName(request.getRoomName());
        infra.setType(request.getType());
        infra.setLocation(request.getLocation());
        infra.setCapacity(request.getCapacity());
        infra.setDescription(request.getDescription());
        infra.setPremises(premises);

        Infrastructure updated = infrastructureRepository.save(infra);

        return new InfrastructureResponse(updated.getInfrastructureId(), updated.getRoomName(), updated.getType(),
                updated.getLocation(), updated.getCapacity(), updated.getDescription(),
                updated.getPremises().getPremisesId(), updated.getPremises().getName());
    }

    @Override
    public void deleteInfrastructure(int id) {
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
                        .premisesTitle(filteredInfrastructure.getPremise().getName())
                        .capacity(filteredInfrastructure.getCapacity())
                        .build()).toList();
        return ApiResponse.onSuccess(listOfPremises);
    }

}
