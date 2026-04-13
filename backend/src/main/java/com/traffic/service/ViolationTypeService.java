package com.traffic.service;

import com.traffic.dto.ViolationTypeRequest;
import com.traffic.model.ViolationType;
import com.traffic.repository.ViolationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ViolationTypeService {

    @Autowired
    private ViolationTypeRepository violationTypeRepository;

    public ViolationType createViolationType(ViolationTypeRequest request) {
        ViolationType type = new ViolationType();
        type.setViolationName(request.getViolationName());
        type.setDescription(request.getDescription());
        type.setBaseFineAmount(request.getBaseFineAmount());
        return violationTypeRepository.save(type);
    }

    public List<ViolationType> getAllViolationTypes() {
        return violationTypeRepository.findAll();
    }
}
