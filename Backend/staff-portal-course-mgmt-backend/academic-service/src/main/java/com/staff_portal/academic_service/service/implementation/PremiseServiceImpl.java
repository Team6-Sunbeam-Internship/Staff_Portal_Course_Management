package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.AddressDTO;
import com.staff_portal.academic_service.dto.request.PremiseRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.PremiseResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.model.Address;
import com.staff_portal.academic_service.model.Premise;
import com.staff_portal.academic_service.repository.PremiseRepository;
import com.staff_portal.academic_service.service.interfaces.PremiseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PremiseServiceImpl implements PremiseService {

    private final PremiseRepository premiseRepository;

    @Override
    public ApiResponse<UUID> createPremise(PremiseRequestDTO request) {
        Premise premise = Premise.builder()
                .premiseName(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .address(mapAddress(request.getAddress()))
                .build();
        Premise savedPremise = premiseRepository.save(premise);
        return ApiResponse.onSuccess(savedPremise.getPremiseId());
    }


    @Override
    public ApiResponse<String> updatePremise(UUID id, PremiseRequestDTO request) {
        Premise existingPremise = premiseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Premise with id " + id + " not found"));

        existingPremise.setPremiseName(request.getTitle());
        existingPremise.setType(request.getType());
        existingPremise.setAddress(mapAddress(request.getAddress()));
        premiseRepository.save(existingPremise);
        return ApiResponse.onSuccess(String.format("Premise with id %s has been updated", id));
    }

    private Address mapAddress(AddressDTO addressDTO) {
        return Address.builder()
                .line1(addressDTO.getLine1())
                .line2(addressDTO.getLine2())
                .city(addressDTO.getCity())
                .state(addressDTO.getState())
                .country(addressDTO.getCountry())
                .postalCode(addressDTO.getPostalCode())
                .build();
    }
    private AddressDTO getAddressDTO(Address address){
        return AddressDTO.builder()
                .line1(address.getLine1())
                .line2(address.getLine2())
                .city(address.getCity())
                .state(address.getState())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .build();
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
                        .id(filteredPremise.getPremiseId())
                        .title(filteredPremise.getPremiseName())
                        .address(getAddressDTO(filteredPremise.getAddress()))
                        .description(filteredPremise.getDescription())
                        .type(filteredPremise.getType())
                        .build()
                ).toList();
        return ApiResponse.onSuccess(listOfPremises);
    }

}
