package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import java.util.UUID;

import com.staff_portal.academic_service.dto.request.PremiseRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.model.Premise;
import com.staff_portal.academic_service.repository.PremiseRepository;
import org.springframework.stereotype.Service;
import com.staff_portal.academic_service.dto.response.PremiseResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.service.interfaces.PremiseService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PremiseServiceImpl implements PremiseService {

	private final PremiseRepository premiseRepository;

	@Override
	public ApiResponse<UUID> createPremise(PremiseRequest request) {
        Premise premise = Premise.builder()
                .name(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .address(request.getAddress())
                .build();
        Premise savedPremise = premiseRepository.save(premise);
        return ApiResponse.onSuccess(savedPremise.getPremiseId());
    }

	@Override
	public ApiResponse<String> updatePremise(UUID id, PremiseRequest request) {
		Premise existingPremise = premiseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Premise with id " + id + " not found"));

		existingPremise.setName(request.getTitle());
		existingPremise.setType(request.getType());
		existingPremise.setAddress(request.getAddress());
		premiseRepository.save(existingPremise);
        return ApiResponse.onSuccess(String.format("Premise with id %s has been updated", id));
	}

	@Override
	public void deletePremise(UUID id) {
		Premise premises = premiseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Premises with id " + id + " not found"));
		premises.setDeleted(true);
		premiseRepository.save(premises);
	}

	@Override
	public ApiResponse<List<PremiseResponse>> findAll() {
        List<PremiseResponse> listOfPremises = premiseRepository
                .findAll()
                .stream()
                .filter(premise -> !premise.isDeleted())
                .map(filteredPremise -> PremiseResponse.builder()
                        .premisesId(filteredPremise.getPremiseId())
                        .title(filteredPremise.getName())
                        .address(filteredPremise.getAddress())
                        .description(filteredPremise.getDescription())
                        .type(filteredPremise.getType())
                        .build()
                ).toList();
        return ApiResponse.onSuccess(listOfPremises);
    }

}
