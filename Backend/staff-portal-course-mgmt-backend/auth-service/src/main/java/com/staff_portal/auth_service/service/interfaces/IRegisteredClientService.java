package com.staff_portal.auth_service.service.interfaces;

import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;

public interface IRegisteredClientService extends RegisteredClientRepository {
    
    void save(RegisteredClient registeredClient);
    
    RegisteredClient findById(String id);
    
    RegisteredClient findByClientId(String clientId);

    boolean existsByClientId(String clientId);
}