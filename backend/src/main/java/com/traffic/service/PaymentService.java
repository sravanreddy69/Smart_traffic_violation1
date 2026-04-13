package com.traffic.service;

import com.traffic.dto.PaymentRequest;
import com.traffic.model.PaymentTransaction;
import com.traffic.model.ViolationTicket;
import com.traffic.model.enums.PaymentStatus;
import com.traffic.model.enums.TicketStatus;
import com.traffic.repository.PaymentTransactionRepository;
import com.traffic.repository.ViolationTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentTransactionRepository paymentRepository;
    @Autowired
    private ViolationTicketService ticketService;
    @Autowired
    private ViolationTicketRepository ticketRepository;

    public PaymentTransaction processPayment(PaymentRequest request) {
        // Trigger penalty check if needed
        ViolationTicket ticket = ticketService.getTicketById(request.getTicketId());

        if (ticket.getTicketStatus() == TicketStatus.DISPUTED) {
            throw new RuntimeException("Disputed ticket cannot be paid");
        }
        if (ticket.getTicketStatus() == TicketStatus.CANCELLED) {
            throw new RuntimeException("Cancelled ticket cannot be paid");
        }
        if (ticket.getTicketStatus() == TicketStatus.PAID) {
            throw new RuntimeException("Ticket is already paid");
        }

        PaymentTransaction tx = new PaymentTransaction();
        tx.setViolationTicket(ticket);
        tx.setAmount(request.getAmount());
        tx.setPaymentDate(LocalDateTime.now());
        tx.setReferenceId(UUID.randomUUID().toString());

        if (request.getAmount() >= ticket.getFineAmount()) {
            tx.setPaymentStatus(PaymentStatus.SUCCESS);
            ticket.setTicketStatus(TicketStatus.PAID);
            ticketRepository.save(ticket);
        } else {
            tx.setPaymentStatus(PaymentStatus.FAILED);
        }

        return paymentRepository.save(tx);
    }

    public List<PaymentTransaction> getAllPayments() {
        return paymentRepository.findAll();
    }
}
