package com.traffic.controller;

import com.traffic.dto.PaymentRequest;
import com.traffic.model.PaymentTransaction;
import com.traffic.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentTransaction> processPayment(@RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }

    @GetMapping
    public ResponseEntity<List<PaymentTransaction>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
