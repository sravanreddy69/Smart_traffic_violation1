package com.traffic.controller;

import com.traffic.dto.TicketRequest;
import com.traffic.model.ViolationTicket;
import com.traffic.repository.ViolationTicketRepository;
import com.traffic.service.ViolationTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private ViolationTicketService ticketService;

    @Autowired
    private ViolationTicketRepository ticketRepository;

    @PostMapping
    public ResponseEntity<ViolationTicket> issueTicket(@RequestBody TicketRequest request) {
        return ResponseEntity.ok(ticketService.issueTicket(request));
    }

    @GetMapping
    public ResponseEntity<List<ViolationTicket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ViolationTicket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUnpaidFineCount", ticketRepository.countUnpaidFines());
        stats.put("mostCommonViolationType", ticketRepository.findMostCommonViolationType());
        stats.put("finesCollectedPerType", ticketRepository.getTotalFinesCollectedPerType());
        return ResponseEntity.ok(stats);
    }
}
