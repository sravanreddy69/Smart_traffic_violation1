package com.traffic.controller;

import com.traffic.dto.ViolationTypeRequest;
import com.traffic.model.ViolationType;
import com.traffic.service.ViolationTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/violations")
public class ViolationController {

    @Autowired
    private ViolationTypeService violationTypeService;

    @PostMapping
    public ResponseEntity<ViolationType> createViolationType(@RequestBody ViolationTypeRequest request) {
        return ResponseEntity.ok(violationTypeService.createViolationType(request));
    }

    @GetMapping
    public ResponseEntity<List<ViolationType>> getAllViolationTypes() {
        return ResponseEntity.ok(violationTypeService.getAllViolationTypes());
    }
}
