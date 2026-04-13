package com.traffic.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long ticketId;
    private Double amount;
}
