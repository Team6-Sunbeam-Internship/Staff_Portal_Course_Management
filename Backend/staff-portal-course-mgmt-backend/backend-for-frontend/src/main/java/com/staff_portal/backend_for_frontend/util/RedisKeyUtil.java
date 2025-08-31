package com.staff_portal.backend_for_frontend.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RedisKeyUtil {
    private static final String BFF_PREFIX = "bff:";
    private static final String AUTH_REQUEST_PREFIX = BFF_PREFIX + "authreq:";
    private static final String AUTHORIZED_CLIENT_PREFIX = BFF_PREFIX + "authorized:";
    private static final String STATE_PREFIX = BFF_PREFIX + "state:";
    private static final String OAUTH2_AUTHORIZED_CLIENT_SERVICE = BFF_PREFIX + "oauth2:" + "client:";

    public String buildAuthRequestKey(String state) {
        return AUTH_REQUEST_PREFIX + state;
    }

    public String buildAuthorizedClientKey(String principalId, String clientId) {
        return AUTHORIZED_CLIENT_PREFIX + principalId + ":" + clientId;
    }

    public String buildStateKey(String sessionId, String type) {
        return STATE_PREFIX + sessionId + ":" + type;
    }

    public String buildAuthorizedClientServiceKey(String clientRegistrationId, String principalName){
        return OAUTH2_AUTHORIZED_CLIENT_SERVICE + clientRegistrationId + ":" + principalName;
    }
}
