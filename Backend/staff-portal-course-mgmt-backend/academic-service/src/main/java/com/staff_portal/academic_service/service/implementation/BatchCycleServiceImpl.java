package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import org.springframework.data.domain.Sort;
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
	    BatchCycle entity = new BatchCycle();
	    entity.setCycleName(request.getCycleName());
	    entity.setDescription(request.getDescription());
	    entity.setStartDate(request.getStartDate());
	    entity.setEndDate(request.getEndDate());

	    BatchCycle saved = repository.save(entity);

	    return new BatchCycleResponse(
	        saved.getBatchCycleId(),
	        saved.getCycleName(),
	        saved.getDescription(),
	        saved.getStartDate(),
	        saved.getEndDate()
	    );
	}

	@Override
	public List<BatchCycleResponse> findAll() {
	    return repository.findAll(Sort.by("batchCycleId").ascending())
	            .stream()
	            .map(batch -> new BatchCycleResponse(
	                    batch.getBatchCycleId(),
	                    batch.getCycleName(),
	                    batch.getDescription(),
	                    batch.getStartDate(),
	                    batch.getEndDate()
	            ))
	            .toList();
	}
		
	@Override
	public BatchCycleResponse findById(int id) {
	    BatchCycle batch = repository.findById(id)
	            .orElseThrow(() -> new RuntimeException("BatchCycle not found with id " + id));
	    return new BatchCycleResponse(
	            batch.getBatchCycleId(),
	            batch.getCycleName(),
	            batch.getDescription(),
	            batch.getStartDate(),
	            batch.getEndDate()
	    );
	}
	
	@Override
	public BatchCycleResponse updateBatchCycle(int id, BatchCycleRequest request) {
	    BatchCycle batch = repository.findById(id)
	            .orElseThrow(() -> new RuntimeException("BatchCycle not found with id " + id));

	    batch.setCycleName(request.getCycleName());
	    batch.setDescription(request.getDescription());
	    batch.setStartDate(request.getStartDate());
	    batch.setEndDate(request.getEndDate());

	    BatchCycle updated = repository.save(batch);

	    return new BatchCycleResponse(
	            updated.getBatchCycleId(),
	            updated.getCycleName(),
	            updated.getDescription(),
	            updated.getStartDate(),
	            updated.getEndDate()
	    );
	}

	 
	 @Override
	 public void deleteBatchCycle(int id) {
	   
	     if (!repository.existsById(id)) {
	         throw new RuntimeException("BatchCycle not found with id " + id);
	     }
	     
	     repository.deleteById(id);
	 }
	 
	
	 }


