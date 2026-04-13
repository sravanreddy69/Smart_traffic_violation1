package com.traffic.dto;

import com.traffic.model.enums.VehicleType;
import lombok.Data;

@Data
public class VehicleRequest {
    private String vehicleNumber;
    private Long ownerId;
    private VehicleType vehicleType;
}
