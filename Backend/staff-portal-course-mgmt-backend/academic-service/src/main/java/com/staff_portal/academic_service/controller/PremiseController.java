package com.staff_portal.academic_service.controller;

import java.util.List;
import java.util.UUID;

import com.staff_portal.academic_service.dto.request.PremiseRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.staff_portal.academic_service.dto.response.PremiseResponse;
import com.staff_portal.academic_service.service.interfaces.PremiseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/premise")
public class PremiseController {

	private final PremiseService premiseService;

	@PostMapping("/create")
	public ResponseEntity<ApiResponse<UUID>> create(@RequestBody PremiseRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(premiseService.createPremise(request));
	}

	@PutMapping("/{id}")
	public PremiseResponse updatePremises(@PathVariable int id, @RequestBody PremiseRequest request) {
		return premiseService.updatePremises(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePremises(@PathVariable int id) {
		premiseService.deletePremises(id);
		return ResponseEntity.ok("Premises with id " + id + " deleted successfully");
	}

	@GetMapping("/getAll")
	public ResponseEntity<ApiResponse<List<PremiseResponse>>> getAllPremises() {
		return ResponseEntity.status(HttpStatus.OK).body(premiseService.findAll());
	}

}
