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
		// TODO Auto-generated method stub
		return null;
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
