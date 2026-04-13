package com.traffic.repository;

import com.traffic.model.ViolationTicket;
import com.traffic.model.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ViolationTicketRepository extends JpaRepository<ViolationTicket, Long> {

    // 1 JOIN query: Fetch violation ticket with vehicle and owner details
    @Query("SELECT t FROM ViolationTicket t JOIN FETCH t.vehicle v JOIN FETCH v.owner u")
    List<ViolationTicket> findAllTicketsWithVehicleAndOwner();

    // 1 Aggregate query: Total unpaid fines count
    @Query("SELECT count(t) FROM ViolationTicket t WHERE t.ticketStatus IN ('PENDING_PAYMENT', 'OVERDUE')")
    Long countUnpaidFines();
    
    // Most common violation type
    @Query(value = "SELECT v.violation_name FROM violation_tickets t JOIN violation_types v ON t.violation_type_id = v.id GROUP BY v.violation_name ORDER BY COUNT(t.id) DESC LIMIT 1", nativeQuery = true)
    String findMostCommonViolationType();

    // Total fines collected per violation type
    @Query(value = "SELECT v.violation_name as violationName, SUM(t.fine_amount) as totalCollected FROM violation_tickets t JOIN violation_types v ON t.violation_type_id = v.id WHERE t.ticket_status = 'PAID' GROUP BY v.violation_name", nativeQuery = true)
    List<Object[]> getTotalFinesCollectedPerType();
    
    List<ViolationTicket> findByVehicleOwnerId(Long ownerId);
}
