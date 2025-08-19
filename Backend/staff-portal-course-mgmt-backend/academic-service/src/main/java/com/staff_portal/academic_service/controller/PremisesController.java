package com.staff_portal.academic_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.academic_service.dto.request.PremisesRequest;
import com.staff_portal.academic_service.dto.response.PremisesResponse;
import com.staff_portal.academic_service.service.interfaces.PremisesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/premises")
public class PremisesController {

	private final PremisesService premisesService;
	
	@PostMapping
    public ResponseEntity<PremisesResponse> create(@RequestBody PremisesRequest request) {
        PremisesResponse response = premisesService.createPremises(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
	
	@PutMapping("/{id}")
	public PremisesResponse updatePremises(@PathVariable int id, @RequestBody PremisesRequest request) {
	    return premisesService.updatePremises(id, request);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePremises(@PathVariable int id) {
	    premisesService.deletePremises(id);
	    return ResponseEntity.ok("Premises with id " + id + " deleted successfully");
	}
	
}
