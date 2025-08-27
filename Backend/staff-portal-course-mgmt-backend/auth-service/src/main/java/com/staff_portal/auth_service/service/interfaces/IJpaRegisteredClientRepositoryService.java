package com.staff_portal.auth_service.service.interfaces;

import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;

public interface IJpaRegisteredClientRepositoryService extends RegisteredClientRepository {
    boolean existsByClientId(String clientId);
}
