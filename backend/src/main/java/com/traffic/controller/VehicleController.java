package com.traffic.controller;

import com.traffic.dto.VehicleRequest;
import com.traffic.model.Vehicle;
import com.traffic.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<Vehicle> registerVehicle(@RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.registerVehicle(request));
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }
}
