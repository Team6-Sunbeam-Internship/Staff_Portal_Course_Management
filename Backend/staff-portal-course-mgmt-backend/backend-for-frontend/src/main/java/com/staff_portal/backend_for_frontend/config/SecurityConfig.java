package com.staff_portal.backend_for_frontend.config;

import com.staff_portal.backend_for_frontend.repository.CustomOidcUserService;
import com.staff_portal.backend_for_frontend.security.CustomLogoutSuccessHandler;
import com.staff_portal.backend_for_frontend.security.OAuth2LoginFailureHandler;
import com.staff_portal.backend_for_frontend.security.OAuth2LoginSuccessHandler;
import com.staff_portal.backend_for_frontend.service.StatePreservationService;
import com.staff_portal.backend_for_frontend.service.TokenService;
import com.staff_portal.backend_for_frontend.util.CookieUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.*;
import org.springframework.security.oauth2.client.endpoint.DefaultOAuth2TokenRequestHeadersConverter;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.endpoint.RestClientAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.RestClientRefreshTokenTokenResponseClient;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.*;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {
    private final OAuth2EndpointsConfig oAuth2EndpointsConfig;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(OAuth2EndpointsConfig endpointsConfig, CorsConfigurationSource corsConfigurationSource) {
        this.oAuth2EndpointsConfig = endpointsConfig;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository, AuthorizationRequestRepository<OAuth2AuthorizationRequest> authorizationRequestRepository, CustomLogoutSuccessHandler customLogoutSuccessHandler, StatePreservationService statePreservationService, CustomOidcUserService customOidcUserService, OAuth2AuthorizedClientRepository redisOAuth2AuthorizedClientRepository, CookieUtil cookieUtil) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/", "/login", "/error/**","/v3/api-docs","/swagger-ui/index.html", "/spin", "/static/**", "/webjars/**", "/bff/proxy/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login")
                        .authorizationEndpoint(authorization -> authorization
                                .baseUri("/oauth2/authorization")
                                .authorizationRequestRepository(authorizationRequestRepository)
                                .authorizationRequestResolver(authorizationRequestResolver(clientRegistrationRepository))
                        )
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/login/oauth2/code/*")
                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .oidcUserService(customOidcUserService)
                        )
                        .successHandler(oauth2LoginSuccessHandler(statePreservationService, customOidcUserService, cookieUtil))
                        .failureHandler(oauth2LoginFailureHandler(cookieUtil))
                )
                .oauth2Client(oauth2 -> oauth2
                        .authorizedClientRepository(redisOAuth2AuthorizedClientRepository)
                        .authorizationCodeGrant(codeGrant -> codeGrant
                                .authorizationRequestRepository(authorizationRequestRepository)
                                .accessTokenResponseClient(authorizationCodeTokenResponseClient())
                        )
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler(customLogoutSuccessHandler)
                        .invalidateHttpSession(true)
                        .deleteCookies("BFF_SESSION", "JSESSIONID")
                )
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers("/bff/proxy/**")
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .maximumSessions(1)
                        .maxSessionsPreventsLogin(false)
                )
                .headers(Customizer.withDefaults())
        ;

        return http.build();
    }

    private OAuth2AuthorizationRequestResolver authorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository) {

        DefaultOAuth2AuthorizationRequestResolver authorizationRequestResolver =
                new DefaultOAuth2AuthorizationRequestResolver(
                        clientRegistrationRepository, "/oauth2/authorization");
        authorizationRequestResolver.setAuthorizationRequestCustomizer(OAuth2AuthorizationRequestCustomizers.withPkce());

        return authorizationRequestResolver;
    }

    @Bean
    public RestClientAuthorizationCodeTokenResponseClient authorizationCodeTokenResponseClient() {
        RestClientAuthorizationCodeTokenResponseClient client = new RestClientAuthorizationCodeTokenResponseClient();

        DefaultOAuth2TokenRequestHeadersConverter<OAuth2AuthorizationCodeGrantRequest> headersConverter = new DefaultOAuth2TokenRequestHeadersConverter<>();
        headersConverter.setEncodeClientCredentials(false);
        client.setHeadersConverter(headersConverter);
        return client;
    }

    @Bean
    public RestClientRefreshTokenTokenResponseClient refreshTokenTokenResponseClient() {
        return new RestClientRefreshTokenTokenResponseClient();
    }

    @Bean
    public OAuth2AuthorizedClientManager auth2AuthorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientService authorizedClientService) {

        OAuth2AuthorizedClientProvider authorizedClientProvider = OAuth2AuthorizedClientProviderBuilder.builder()
                .authorizationCode()
                .refreshToken(configurer -> configurer
                        .accessTokenResponseClient(refreshTokenTokenResponseClient()))
                .build();

        AuthorizedClientServiceOAuth2AuthorizedClientManager auth2AuthorizedClientManager = new AuthorizedClientServiceOAuth2AuthorizedClientManager(clientRegistrationRepository, authorizedClientService);
        auth2AuthorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);
        auth2AuthorizedClientManager.setAuthorizationSuccessHandler(oauth2AuthorizationSuccessHandler());
        auth2AuthorizedClientManager.setAuthorizationFailureHandler(oauth2AuthorizationFailureHandler());
        return auth2AuthorizedClientManager;
    }

    @Bean
    public OAuth2LoginSuccessHandler oauth2LoginSuccessHandler(StatePreservationService statePreservationService, CustomOidcUserService oidcUserService, CookieUtil cookieUtil) {
        return new OAuth2LoginSuccessHandler(statePreservationService, oidcUserService, cookieUtil);
    }

    @Bean
    public OAuth2LoginFailureHandler oauth2LoginFailureHandler(CookieUtil cookieUtil) {
        return new OAuth2LoginFailureHandler(cookieUtil);
    }

    @Bean
    public OAuth2AuthorizationSuccessHandler oauth2AuthorizationSuccessHandler() {
        return new com.staff_portal.backend_for_frontend.security.OAuth2AuthorizationSuccessHandler();
    }

    @Bean
    public OAuth2AuthorizationFailureHandler oauth2AuthorizationFailureHandler() {
        return new com.staff_portal.backend_for_frontend.security.OAuth2AuthorizationFailureHandler();
    }

    @Bean
    public CustomLogoutSuccessHandler customLogoutSuccessHandler(OAuth2AuthorizedClientRepository oAuth2AuthorizedClientRepository, TokenService tokenService) {
        return new CustomLogoutSuccessHandler(oAuth2AuthorizedClientRepository, tokenService, oAuth2EndpointsConfig);
    }
}
