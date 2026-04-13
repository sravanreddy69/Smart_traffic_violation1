package com.traffic.service;

import com.traffic.dto.DisputeRequest;
import com.traffic.dto.DisputeResolveRequest;
import com.traffic.model.Dispute;
import com.traffic.model.User;
import com.traffic.model.ViolationTicket;
import com.traffic.model.enums.DisputeStatus;
import com.traffic.model.enums.Role;
import com.traffic.model.enums.TicketStatus;
import com.traffic.repository.DisputeRepository;
import com.traffic.repository.UserRepository;
import com.traffic.repository.ViolationTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;
    @Autowired
    private ViolationTicketRepository ticketRepository;
    @Autowired
    private UserRepository userRepository;

    public Dispute raiseDispute(DisputeRequest request) {
        ViolationTicket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if(ticket.getTicketStatus() == TicketStatus.PAID) {
            throw new RuntimeException("Cannot dispute a paid ticket");
        }

        User citizen = userRepository.findById(request.getRaisedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(citizen.getRole() != Role.CITIZEN) {
            throw new RuntimeException("Only CITIZEN can raise dispute");
        }

        Dispute dispute = new Dispute();
        dispute.setViolationTicket(ticket);
        dispute.setRaisedBy(citizen);
        dispute.setDisputeReason(request.getDisputeReason());
        dispute.setDisputeStatus(DisputeStatus.OPEN);

        ticket.setTicketStatus(TicketStatus.DISPUTED);
        ticketRepository.save(ticket);

        return disputeRepository.save(dispute);
    }

    public Dispute resolveDispute(Long id, DisputeResolveRequest request) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));

        User reviewer = userRepository.findById(request.getResolvedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(reviewer.getRole() != Role.REVIEW_OFFICER && reviewer.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only REVIEW_OFFICER or ADMIN can resolve disputes");
        }

        dispute.setResolvedBy(reviewer);
        dispute.setResolutionRemark(request.getResolutionRemark());
        dispute.setDisputeStatus(request.getDisputeStatus());
        dispute.setResolvedAt(LocalDateTime.now());

        // update ticket status
        ViolationTicket ticket = dispute.getViolationTicket();
        if(request.getDisputeStatus() == DisputeStatus.APPROVED) {
            ticket.setTicketStatus(TicketStatus.CANCELLED);
        } else if(request.getDisputeStatus() == DisputeStatus.REJECTED) {
            ticket.setTicketStatus(TicketStatus.PENDING_PAYMENT); // Revert to pending
        }
        ticketRepository.save(ticket);

        return disputeRepository.save(dispute);
    }
}
