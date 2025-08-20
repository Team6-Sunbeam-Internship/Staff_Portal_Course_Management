package com.staff_portal.academic_service.service.implementation;

import org.springframework.stereotype.Service;
import com.staff_portal.academic_service.dto.request.InfrastructureRequest;
import com.staff_portal.academic_service.dto.response.InfrastructureResponse;
import com.staff_portal.academic_service.model.Infrastructure;
import com.staff_portal.academic_service.model.Premises;
import com.staff_portal.academic_service.repository.InfrastructureRepository;
import com.staff_portal.academic_service.repository.PremisesRepository;
import com.staff_portal.academic_service.service.interfaces.InfrastructureService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InfrastructureServiceImpl implements InfrastructureService {

	private final InfrastructureRepository infrastructureRepository;
    private final PremisesRepository premisesRepository;

    @Override
    public InfrastructureResponse createInfrastructure(InfrastructureRequest request) {
        Premises premises = premisesRepository.findById(request.getPremisesId())
                .orElseThrow(() -> new RuntimeException("Premises not found"));

        Infrastructure entity = new Infrastructure();
        entity.setRoomName(request.getRoomName());
        entity.setType(request.getType());
        entity.setLocation(request.getLocation());
        entity.setCapacity(request.getCapacity());
        entity.setDescription(request.getDescription());
        entity.setPremises(premises);

        Infrastructure saved = infrastructureRepository.save(entity);

        return new InfrastructureResponse(
                saved.getInfrastructureId(),
                saved.getRoomName(),
                saved.getType(),
                saved.getLocation(),
                saved.getCapacity(),
                saved.getDescription(),
                saved.getPremises().getPremisesId(),
                saved.getPremises().getName()
        );
    }

    
    @Override
    public InfrastructureResponse getInfrastructureById(int id) {
        Infrastructure infra = infrastructureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Infrastructure not found with id: " + id));

        return new InfrastructureResponse(
                infra.getInfrastructureId(),
                infra.getRoomName(),
                infra.getType(),
                infra.getLocation(),
                infra.getCapacity(),
                infra.getDescription(),
                infra.getPremises().getPremisesId(),
                infra.getPremises().getName()
        );
    }
	
   
	

}
