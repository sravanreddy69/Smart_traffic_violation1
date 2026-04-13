package com.traffic.dto;

import com.traffic.model.enums.DisputeStatus;
import lombok.Data;

@Data
public class DisputeResolveRequest {
    private Long resolvedById;
    private String resolutionRemark;
    private DisputeStatus disputeStatus;
}
