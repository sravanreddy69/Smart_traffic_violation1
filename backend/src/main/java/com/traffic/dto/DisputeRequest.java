package com.traffic.dto;

import lombok.Data;

@Data
public class DisputeRequest {
    private Long ticketId;
    private Long raisedById;
    private String disputeReason;
}
