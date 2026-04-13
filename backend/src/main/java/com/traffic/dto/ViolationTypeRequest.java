package com.traffic.dto;

import lombok.Data;

@Data
public class ViolationTypeRequest {
    private String violationName;
    private String description;
    private Double baseFineAmount;
}
