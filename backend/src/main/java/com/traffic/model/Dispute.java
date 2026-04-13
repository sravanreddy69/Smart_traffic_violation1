package com.traffic.model;

import com.traffic.model.enums.DisputeStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "disputes")
public class Dispute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "violation_ticket_id", nullable = false)
    private ViolationTicket violationTicket;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "raised_by_id", nullable = false)
    private User raisedBy;

    @Column(nullable = false, length = 500)
    private String disputeReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeStatus disputeStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resolved_by_id")
    private User resolvedBy;

    @Column(length = 500)
    private String resolutionRemark;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;
}
