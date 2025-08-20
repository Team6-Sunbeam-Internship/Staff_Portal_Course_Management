package com.staff_portal.academic_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.academic_service.dto.request.InfrastructureRequest;
import com.staff_portal.academic_service.dto.response.InfrastructureResponse;
import com.staff_portal.academic_service.service.interfaces.InfrastructureService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/infrastructures")
@RequiredArgsConstructor
public class InfrastructureController {
	
	 private final InfrastructureService infrastructureService;

	    // Create Infrastructure
	    @PostMapping
	    public ResponseEntity<InfrastructureResponse> createInfrastructure(@RequestBody InfrastructureRequest request) {
	        InfrastructureResponse response = infrastructureService.createInfrastructure(request);
	        return new ResponseEntity<>(response, HttpStatus.CREATED);
	    }
	    
	    //get Infrastructure
	    @GetMapping("/{id}")
	    public ResponseEntity<InfrastructureResponse> getInfrastructureById(@PathVariable int id) {
	        return ResponseEntity.ok(infrastructureService.getInfrastructureById(id));
	    }

}
