package com.staff_portal.backend_for_frontend.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreserveCommandDTO {
    private String commandId;
    private String commandName;
    private String originPage;
    private JsonNode payload;
    private String idempotencyKey;
    private Instant createdAt;
    private Instant expiresAt;
}
