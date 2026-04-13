package com.traffic.controller;

import com.traffic.dto.DisputeRequest;
import com.traffic.dto.DisputeResolveRequest;
import com.traffic.model.Dispute;
import com.traffic.repository.DisputeRepository;
import com.traffic.service.DisputeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    @Autowired
    private DisputeService disputeService;
    
    @Autowired
    private DisputeRepository disputeRepository;

    @PostMapping
    public ResponseEntity<Dispute> raiseDispute(@RequestBody DisputeRequest request) {
        return ResponseEntity.ok(disputeService.raiseDispute(request));
    }

    @GetMapping
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        return ResponseEntity.ok(disputeRepository.findAll());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Dispute> resolveDispute(@PathVariable Long id, @RequestBody DisputeResolveRequest request) {
        return ResponseEntity.ok(disputeService.resolveDispute(id, request));
    }
}
