package com.traffic.service;

import com.traffic.dto.TicketRequest;
import com.traffic.model.User;
import com.traffic.model.Vehicle;
import com.traffic.model.ViolationTicket;
import com.traffic.model.ViolationType;
import com.traffic.model.enums.Role;
import com.traffic.model.enums.TicketStatus;
import com.traffic.repository.UserRepository;
import com.traffic.repository.VehicleRepository;
import com.traffic.repository.ViolationTicketRepository;
import com.traffic.repository.ViolationTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ViolationTicketService {

    @Autowired
    private ViolationTicketRepository ticketRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private ViolationTypeRepository typeRepository;
    @Autowired
    private UserRepository userRepository;

    public ViolationTicket issueTicket(TicketRequest request) {
        User officer = userRepository.findById(request.getIssuedById())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (officer.getRole() != Role.TRAFFIC_OFFICER) {
            throw new RuntimeException("Only TRAFFIC_OFFICER can issue tickets");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        ViolationType type = typeRepository.findById(request.getViolationTypeId())
                .orElseThrow(() -> new RuntimeException("Violation Type not found"));

        ViolationTicket ticket = new ViolationTicket();
        ticket.setVehicle(vehicle);
        ticket.setViolationType(type);
        ticket.setIssuedBy(officer);
        ticket.setViolationDate(LocalDateTime.now());
        ticket.setViolationLocation(request.getViolationLocation());
        ticket.setFineAmount(type.getBaseFineAmount());
        ticket.setDueDate(request.getDueDate());
        ticket.setTicketStatus(TicketStatus.ISSUED);
        
        return ticketRepository.save(ticket);
    }

    public List<ViolationTicket> getAllTickets() {
        return ticketRepository.findAllTicketsWithVehicleAndOwner();
    }

    public ViolationTicket getTicketById(Long id) {
        ViolationTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        // Dynamic Overdue check and Penalty calculation
        if ((ticket.getTicketStatus() == TicketStatus.ISSUED || ticket.getTicketStatus() == TicketStatus.PENDING_PAYMENT)
                && LocalDate.now().isAfter(ticket.getDueDate())) {
            ticket.setTicketStatus(TicketStatus.OVERDUE);
            // 10% penalty
            ticket.setFineAmount(ticket.getFineAmount() * 1.10);
            ticketRepository.save(ticket);
        }
        return ticket;
    }
}
