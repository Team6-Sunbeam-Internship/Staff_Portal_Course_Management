package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.staff_portal.academic_service.dto.request.InfrastructureRequest;
import com.staff_portal.academic_service.dto.response.InfrastructureResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
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
		Premises premises = premisesRepository.findById(request.getPremisesId()).orElseThrow(
				() -> new ResourceNotFoundException("Premises not found with id: " + request.getPremisesId()));

		Infrastructure entity = new Infrastructure();
		entity.setRoomName(request.getRoomName());
		entity.setType(request.getType());
		entity.setLocation(request.getLocation());
		entity.setCapacity(request.getCapacity());
		entity.setDescription(request.getDescription());
		entity.setPremises(premises);

		Infrastructure saved = infrastructureRepository.save(entity);

		return new InfrastructureResponse(saved.getInfrastructureId(), saved.getRoomName(), saved.getType(),
				saved.getLocation(), saved.getCapacity(), saved.getDescription(), saved.getPremises().getPremisesId(),
				saved.getPremises().getName());
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
	public List<InfrastructureResponse> getAllInfrastructures() {
		List<Infrastructure> infrastructures = infrastructureRepository.findAll().stream()
				.filter(infra -> !infra.isDeleted()).toList();

		return infrastructures.stream()
				.map(infra -> new InfrastructureResponse(infra.getInfrastructureId(), infra.getRoomName(),
						infra.getType(), infra.getLocation(), infra.getCapacity(), infra.getDescription(),
						infra.getPremises().getPremisesId(), infra.getPremises().getName()))
				.toList();
	}

}
