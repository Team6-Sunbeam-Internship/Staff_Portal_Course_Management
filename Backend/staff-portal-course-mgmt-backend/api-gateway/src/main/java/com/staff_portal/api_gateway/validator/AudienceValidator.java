package com.staff_portal.api_gateway.validator;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class AudienceValidator implements OAuth2TokenValidator<Jwt> {
    private static final OAuth2Error INVALID_AUDIENCE = new OAuth2Error(
            "invalid_audience",
            "The required audience is missing",
            "https://tools.ietf.org/html/rfc6750#section-3.1"
    );
    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        List<String> audiences = jwt.getAudience();
        if (audiences == null || audiences.isEmpty()) {
            log.warn("JWT token has no audience claim");
            return OAuth2TokenValidatorResult.failure(INVALID_AUDIENCE);
        }
        log.debug("JWT audiences: {}", audiences);
        return OAuth2TokenValidatorResult.success();
    }
}