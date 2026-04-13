package com.traffic.model;

import com.traffic.model.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;
import org.hibernate.annotations.CreationTimestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "violation_tickets")
public class ViolationTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "violation_type_id", nullable = false)
    private ViolationType violationType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "issued_by_id", nullable = false)
    private User issuedBy;

    @Column(nullable = false)
    private LocalDateTime violationDate;

    @Column(nullable = false)
    private String violationLocation;

    @Column(nullable = false)
    private Double fineAmount;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus ticketStatus;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
