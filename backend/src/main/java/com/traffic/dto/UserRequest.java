package com.traffic.dto;

import com.traffic.model.enums.Role;
import lombok.Data;

@Data
public class UserRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private Role role;
}
