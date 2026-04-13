package com.traffic.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TicketRequest {
    private Long vehicleId;
    private Long violationTypeId;
    private Long issuedById;
    private String violationLocation;
    private LocalDate dueDate;
}
