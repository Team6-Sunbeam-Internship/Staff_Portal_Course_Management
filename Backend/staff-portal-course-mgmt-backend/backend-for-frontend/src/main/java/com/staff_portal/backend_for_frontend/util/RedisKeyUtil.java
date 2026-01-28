package com.staff_portal.backend_for_frontend.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RedisKeyUtil {
    private static final String BFF_PREFIX = "bff:";
    private static final String AUTH_REQUEST_PREFIX = BFF_PREFIX + "oauth2:" + "authreq:";
    private static final String OAUTH2_AUTHORIZED_CLIENT_SERVICE = BFF_PREFIX + "oauth2:" + "client:";
    private static final String CLIENT_REGISTRATION = BFF_PREFIX + "oauth2:" + "client:" + "registration:";
    private static final String PRESERVED_COMMAND = BFF_PREFIX + "PRESERVED_COMMANDS:";

    public String buildAuthRequestKey(String state) {
        return AUTH_REQUEST_PREFIX + state;
    }

    public String buildAuthorizedClientServiceKey(String clientRegistrationId, String principalName) {
        return OAUTH2_AUTHORIZED_CLIENT_SERVICE + clientRegistrationId + ":" + principalName;
    }

    public String buildClientRegistrationKey(String registrationId) {
        return CLIENT_REGISTRATION + registrationId;
    }

    public String buildPRESERVED_COMMANDSKey(String sessionId) {
        return PRESERVED_COMMAND + sessionId;
    }
}
