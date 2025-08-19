package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import org.springframework.stereotype.Service;
import com.staff_portal.academic_service.dto.request.PremisesRequest;
import com.staff_portal.academic_service.dto.response.PremisesResponse;
import com.staff_portal.academic_service.model.Premises;
import com.staff_portal.academic_service.repository.PremisesRepository;
import com.staff_portal.academic_service.service.interfaces.PremisesService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PremisesServiceImpl implements PremisesService {

	 private final PremisesRepository premisesRepository;
	
	  @Override
	    public PremisesResponse createPremises(PremisesRequest request) {
	        Premises entity = new Premises();
	        entity.setName(request.getName());
	        entity.setType(request.getType());
	        entity.setAddress(request.getAddress());
	        entity.setCity(request.getCity());
	        entity.setState(request.getState());
	        entity.setPostalCode(request.getPostalCode());
	        entity.setActive(request.getIsActive());

	        Premises saved = premisesRepository.save(entity);

	        return new PremisesResponse(
	                saved.getPremisesId(),
	                saved.getName(),
	                saved.getType(),
	                saved.getAddress(),
	                saved.getCity(),
	                saved.getState(),
	                saved.getPostalCode(),
	                saved.isActive()
	        );
	    }

	@Override
	public PremisesResponse updatePremises(int id, PremisesRequest request) {
		 Premises existingPremises = premisesRepository.findById(id)
		            .orElseThrow(() -> new RuntimeException("Premises with id " + id + " not found"));

		    // Update fields from request
		    existingPremises.setName(request.getName());
		    existingPremises.setType(request.getType());
		    existingPremises.setAddress(request.getAddress());
		    existingPremises.setCity(request.getCity());
		    existingPremises.setState(request.getState());
		    existingPremises.setPostalCode(request.getPostalCode());

		    // Avoid NullPointerException for boolean
		    if (request.getIsActive() != null) {
		        existingPremises.setActive(request.getIsActive());
		    }

		    Premises updated = premisesRepository.save(existingPremises);

		    return new PremisesResponse(
		            updated.getPremisesId(),
		            updated.getName(),
		            updated.getType(),
		            updated.getAddress(),
		            updated.getCity(),
		            updated.getState(),
		            updated.getPostalCode(),
		            updated.isActive()
		    );
	}

	@Override
	public void deletePremises(int id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<PremisesResponse> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public PremisesResponse findById(int id) {
		// TODO Auto-generated method stub
		return null;
	}

}
