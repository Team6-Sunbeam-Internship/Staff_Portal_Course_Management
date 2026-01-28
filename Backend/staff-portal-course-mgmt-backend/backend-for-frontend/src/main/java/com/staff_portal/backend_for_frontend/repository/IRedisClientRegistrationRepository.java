package com.staff_portal.backend_for_frontend.repository;

import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

import java.util.Set;

public interface IRedisClientRegistrationRepository extends ClientRegistrationRepository,  Iterable<ClientRegistration>  {
    Set<String> getRegistrationIds();
}
