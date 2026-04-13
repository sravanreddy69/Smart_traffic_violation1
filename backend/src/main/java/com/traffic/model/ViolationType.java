package com.traffic.model;

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
@Table(name = "violation_types")
public class ViolationType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String violationName;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double baseFineAmount;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
