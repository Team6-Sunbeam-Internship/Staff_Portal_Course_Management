package com.staff_portal.academic_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.academic_service.dto.request.BatchCycleRequest;
import com.staff_portal.academic_service.dto.response.BatchCycleResponse;
import com.staff_portal.academic_service.service.interfaces.BatchCycleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/batch-cycles")
public class BatchCycleController {

	private final BatchCycleService service;
	
	
	 @PostMapping
	    public BatchCycleResponse create(@RequestBody BatchCycleRequest request) {
	        return service.createBatchCycle(request);
	    }
	 
	 @GetMapping
	 public List<BatchCycleResponse> getAllBatchCycles() {
	     return service.findAll();
	 }
	
}
