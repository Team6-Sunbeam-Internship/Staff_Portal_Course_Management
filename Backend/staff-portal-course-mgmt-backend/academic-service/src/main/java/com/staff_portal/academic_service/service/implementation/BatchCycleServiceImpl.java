package com.staff_portal.academic_service.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.academic_service.dto.request.BatchCycleRequest;
import com.staff_portal.academic_service.dto.response.BatchCycleResponse;
import com.staff_portal.academic_service.model.BatchCycle;
import com.staff_portal.academic_service.repository.BatchCycleRepository;
import com.staff_portal.academic_service.service.interfaces.BatchCycleService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Service
@RequiredArgsConstructor
@Getter
@Setter
public class BatchCycleServiceImpl implements BatchCycleService{
    
	private final BatchCycleRepository repository;

	@Override
	public BatchCycleResponse createBatchCycle(BatchCycleRequest request) {
		BatchCycle entity=new BatchCycle();
		entity.setCycleName(request.getCycleName());
        BatchCycle saved = repository.save(entity);

        BatchCycleResponse response = new BatchCycleResponse();
        response.setBatchCycleId(saved.getBatchCycleId());
        response.setCycleName(saved.getCycleName());

        return response;
	
	}

	@Override
	public List<BatchCycleResponse> findAll() {
		// TODO Auto-generated method stub
		return null;
	}
		
		 
	
	
	
	 }


