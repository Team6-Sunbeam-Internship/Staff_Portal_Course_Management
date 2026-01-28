package com.staff_portal.auth_service.handler;

import com.staff_portal.auth_service.model.users.AuthUser;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;

@Component
@Slf4j
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private static final String ORIGINAL_AUTHORIZE_QUERY = "ORIGINAL_AUTHORIZE_QUERY";
    private final AuthUserRepository authUserRepository;
    private final RequestCache requestCache = new HttpSessionRequestCache();

    public CustomAuthenticationSuccessHandler(AuthUserRepository authUserRepository) {
        this.authUserRepository = authUserRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        String email = authentication.getName();
        AuthUser authUser = authUserRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        // update last login
        log.info("User {} has been logged in", email);
        log.info("Updating last login");
        authUser.setLastLoginAt(Instant.now(Clock.system(ZoneId.of("Asia/Kolkata"))));
        AuthUser savedUser = authUserRepository.save(authUser);
        log.info("Last login has been updated");
        // check is user login first time
        boolean firstTimeLogin = Boolean.TRUE.equals(savedUser.getIsFirstTimeLogin());
        if (firstTimeLogin) {
            log.info("User logged in first time!");
            log.info("redirecting to: {}", "/force-change-password");
            response.sendRedirect("/force-change-password");
            return;
        }
        // Normal Flow
        new SavedRequestAwareAuthenticationSuccessHandler().onAuthenticationSuccess(request, response, authentication);
    }

}

