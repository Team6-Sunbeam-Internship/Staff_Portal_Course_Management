package com.staff_portal.academic_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
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
	
}
