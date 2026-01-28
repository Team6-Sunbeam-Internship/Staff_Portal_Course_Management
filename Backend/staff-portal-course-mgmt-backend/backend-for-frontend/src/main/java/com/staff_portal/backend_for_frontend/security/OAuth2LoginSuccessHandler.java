package com.staff_portal.backend_for_frontend.security;

import com.staff_portal.backend_for_frontend.service.ICustomOidcUserService;
import com.staff_portal.backend_for_frontend.util.CookieUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final ICustomOidcUserService customOidcUserService;
    private final CookieUtil cookieUtil;

    @Value("${bff.frontend.base-url}")
    private String frontendBaseUrl;

    public OAuth2LoginSuccessHandler(ICustomOidcUserService customOidcUserService, CookieUtil cookieUtil) {
        this.customOidcUserService = customOidcUserService;
        this.cookieUtil = cookieUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        String lastRoute = cookieUtil.getLastRoute(request);
        if (lastRoute != null && !lastRoute.isBlank()) {
            cookieUtil.clearLastRoute(response);
            response.sendRedirect(frontendBaseUrl + lastRoute);
            return;
        }
        response.sendRedirect(frontendBaseUrl);
    }

//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
//                                        Authentication authentication) throws IOException, ServletException {
//        if (authentication instanceof OAuth2AuthenticationToken token) {
//
//            // Ensure consistent session ID management
//            String sessionId = getOrCreateBffSessionId(request, response);
//
//            OidcUser principal = (OidcUser) token.getPrincipal();
//            OidcUserInfo userInfo = principal.getUserInfo();
//            List<String> roles = principal.getIdToken().getClaim("roles");
//
//            customOidcUserService.cachedUserData(sessionId, userInfo, roles);
//
//           String lastRoute = cookieUtil.getLastRoute(request);
//           if(lastRoute!= null && !lastRoute.isBlank()){
//               cookieUtil.clearLastRoute(response);
//               log.debug("OAuth2 login success -> redirecting to last SPAroute: {}", lastRoute);
//               response.sendRedirect(frontendBaseUrl + lastRoute);
//               return;
//           }
//           log.debug("OAuth2 login success -> redirecting to frontend base URL : {}", frontendBaseUrl);
//           response.sendRedirect(frontendBaseUrl);
//        }
//    }
//
//    private String getOrCreateBffSessionId(HttpServletRequest request, HttpServletResponse response) {
//        String existingSessionId = cookieUtil.getBffSessionId(request);
//        if (existingSessionId != null) {
//            return existingSessionId;
//        }
//
//        String newSessionId = UUID.randomUUID().toString();
//        ResponseCookie bffSessionCookie = cookieUtil.createSecureBffSessionCookie(newSessionId, 3600);
//        response.addHeader("Set-Cookie", bffSessionCookie.toString());
//        log.debug("Created new BFF session ID for authentication: {}", newSessionId);
//        return newSessionId;
//    }
}