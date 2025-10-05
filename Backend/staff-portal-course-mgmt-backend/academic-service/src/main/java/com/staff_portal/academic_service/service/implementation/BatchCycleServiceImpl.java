package com.staff_portal.academic_service.service.implementation;

import java.util.List;

import com.staff_portal.academic_service.dto.response.ApiResponse;
import org.springframework.stereotype.Service;
import com.staff_portal.academic_service.dto.request.BatchCycleRequest;
import com.staff_portal.academic_service.dto.response.BatchCycleResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
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
public class BatchCycleServiceImpl implements BatchCycleService {

    private final BatchCycleRepository batchCycleRepository;

    @Override
    public ApiResponse<BatchCycleResponse> createBatchCycle(BatchCycleRequest request) {
        BatchCycle batchCycle = BatchCycle.builder()
                .cycleName(request.getTitle())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus())
                .build();
        BatchCycle savedBatchCycle = batchCycleRepository.save(batchCycle);
        return ApiResponse.onSuccess(BatchCycleResponse.builder()
                .batchCycleId(savedBatchCycle.getBatchCycleId())
                .title(savedBatchCycle.getCycleName())
                .description(savedBatchCycle.getDescription())
                .year(savedBatchCycle.getStartDate().getYear())
                .startDate(savedBatchCycle.getStartDate())
                .endDate(savedBatchCycle.getEndDate())
                .status(savedBatchCycle.getStatus())
                .build());
    }

    @Override
    public ApiResponse<List<BatchCycleResponse>> findAll() {

        List<BatchCycleResponse> listOfBatchCycles = batchCycleRepository
                .findAll()
                .stream()
                .filter(batch -> !batch.isDeleted())
                .map(filteredBatchCycle -> BatchCycleResponse.builder()
                        .batchCycleId(filteredBatchCycle.getBatchCycleId())
                        .title(filteredBatchCycle.getCycleName())
                        .description(filteredBatchCycle.getDescription())
                        .year(filteredBatchCycle.getStartDate().getYear())
                        .startDate(filteredBatchCycle.getStartDate())
                        .endDate(filteredBatchCycle.getEndDate())
                        .build()
                ).toList();

        return ApiResponse.onSuccess(listOfBatchCycles);
    }

    @Override
    public BatchCycleResponse findById(int id) {
        BatchCycle batch = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BatchCycle not found with id " + id));
        if (batch.isDeleted()) {
            throw new ResourceNotFoundException("BatchCycle not found with id " + id);
        }
        return new BatchCycleResponse(batch.getBatchCycleId(), batch.getCycleName(), batch.getDescription(),
                batch.getStartDate(), batch.getEndDate(), batch.getStatus());
    }

    @Override
    public BatchCycleResponse updateBatchCycle(int id, BatchCycleRequest request) {
        BatchCycle batch = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BatchCycle not found with id " + id));
        batch.setCycleName(request.getCycleName());
        batch.setDescription(request.getDescription());
        batch.setStartDate(request.getStartDate());
        batch.setEndDate(request.getEndDate());
        batch.setStatus(request.getStatus());

        BatchCycle updated = repository.save(batch);

        return new BatchCycleResponse(updated.getBatchCycleId(), updated.getCycleName(), updated.getDescription(),
                updated.getStartDate(), updated.getEndDate(), updated.getStatus());
    }

    @Override
    public void deleteBatchCycle(int id) {
        BatchCycle batch = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BatchCycle not found with id " + id));
        batch.setDeleted(true);
        repository.save(batch);
    }

}
