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
import com.staff_portal.academic_service.model.Premises;
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
	public PremiseResponse updatePremises(int id, PremiseRequest request) {
		Premises existingPremises = premiseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Premises with id " + id + " not found"));

		existingPremises.setName(request.getName());
		existingPremises.setType(request.getType());
		existingPremises.setAddress(request.getAddress());
		existingPremises.setCity(request.getCity());
		existingPremises.setState(request.getState());
		existingPremises.setPostalCode(request.getPostalCode());

		if (request.getStatus() != null) {
			existingPremises.setStatus(request.getStatus());
		}

		Premises updated = premiseRepository.save(existingPremises);

		return new PremiseResponse(updated.getPremisesId(), updated.getName(), updated.getType(), updated.getAddress(),
				updated.getCity(), updated.getState(), updated.getPostalCode(), updated.getStatus());
	}

	@Override
	public void deletePremises(int id) {
		Premises premises = premiseRepository.findById(id)
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
