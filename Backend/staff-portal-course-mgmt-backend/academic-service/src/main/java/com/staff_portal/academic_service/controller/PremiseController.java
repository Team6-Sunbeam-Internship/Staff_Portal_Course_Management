package com.staff_portal.academic_service.controller;

import com.staff_portal.academic_service.dto.request.PremiseRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.PremiseResponse;
import com.staff_portal.academic_service.service.interfaces.PremiseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/premise")
public class PremiseController {

	private final PremiseService premiseService;

	@PostMapping("/create")
	public ResponseEntity<ApiResponse<UUID>> create(@RequestBody PremiseRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(premiseService.createPremise(request));
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<ApiResponse<String>> updatePremises(@PathVariable UUID id, @RequestBody PremiseRequestDTO request) {
		return ResponseEntity.ok(premiseService.updatePremise(id, request));
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<ApiResponse<String>> deletePremises(@PathVariable UUID id) {
		premiseService.deletePremise(id);
		return ResponseEntity.ok(ApiResponse.onSuccess("Premises with id " + id + " deleted successfully"));
	}

	@GetMapping("/getAll")
	public ResponseEntity<ApiResponse<List<PremiseResponse>>> getAllPremises() {
		return ResponseEntity.status(HttpStatus.OK).body(premiseService.findAll());
	}

}
