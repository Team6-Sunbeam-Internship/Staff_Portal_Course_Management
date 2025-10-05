package com.staff_portal.academic_service.service.implementation;

import java.util.List;

import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.repository.PremiseRepository;
import org.springframework.stereotype.Service;
import com.staff_portal.academic_service.dto.request.PremisesRequest;
import com.staff_portal.academic_service.dto.response.PremiseResponse;
import com.staff_portal.academic_service.enums.PremisesStatus;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.model.Premises;
import com.staff_portal.academic_service.service.interfaces.PremisesService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PremiseServiceImpl implements PremisesService {

	private final PremiseRepository premiseRepository;

	@Override
	public PremiseResponse createPremises(PremisesRequest request) {
		try {
			Premises entity = new Premises();
			entity.setName(request.getName());
			entity.setType(request.getType());
			entity.setAddress(request.getAddress());
			entity.setCity(request.getCity());
			entity.setState(request.getState());
			entity.setPostalCode(request.getPostalCode());
			entity.setStatus(request.getStatus() != null ? request.getStatus() : PremisesStatus.ACTIVE);
			entity.setDeleted(false);

			Premises saved = premiseRepository.save(entity);

			return new PremiseResponse(saved.getPremisesId(), saved.getName(), saved.getType(), saved.getAddress(),
					saved.getCity(), saved.getState(), saved.getPostalCode(), saved.getStatus());
		} catch (Exception e) {
			throw new RuntimeException("Failed to save premises: " + e.getMessage());
		}
	}

	@Override
	public PremiseResponse updatePremises(int id, PremisesRequest request) {
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
