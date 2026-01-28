package com.staff_portal.backend_for_frontend.config;

import com.staff_portal.backend_for_frontend.repository.IRedisClientRegistrationRepository;
import com.staff_portal.backend_for_frontend.security.CustomAuthenticationEntryPoint;
import com.staff_portal.backend_for_frontend.security.CustomLogoutSuccessHandler;
import com.staff_portal.backend_for_frontend.security.OAuth2LoginFailureHandler;
import com.staff_portal.backend_for_frontend.security.OAuth2LoginSuccessHandler;
import com.staff_portal.backend_for_frontend.service.ICustomOidcUserService;
import com.staff_portal.backend_for_frontend.service.TokenService;
import com.staff_portal.backend_for_frontend.util.CookieUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.*;
import org.springframework.security.oauth2.client.endpoint.DefaultOAuth2TokenRequestHeadersConverter;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.endpoint.RestClientAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.RestClientRefreshTokenTokenResponseClient;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.*;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
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
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   IRedisClientRegistrationRepository clientRegistrationRepository,
                                                   AuthorizationRequestRepository<OAuth2AuthorizationRequest> authorizationRequestRepository,
                                                   CustomLogoutSuccessHandler customLogoutSuccessHandler,
                                                   CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
                                                   ICustomOidcUserService customOidcUserService,
                                                   CookieUtil cookieUtil) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/bff/session", "/logout", "/logout-callback", "/login", "/error/**", "/v3/api-docs", "/swagger-ui/index.html", "/spin", "/static/**", "/webjars/**", "/output.css", "/favicon.ico").permitAll()
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
                        .successHandler(oauth2LoginSuccessHandler( customOidcUserService, cookieUtil))
                        .failureHandler(oauth2LoginFailureHandler())
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler(customLogoutSuccessHandler)
                        .invalidateHttpSession(true)
                        .deleteCookies("__Host-bff-session", "JSESSIONID")
                )
                .csrf(csrf -> csrf
                                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                        .ignoringRequestMatchers("/login", "/login/oauth2/code/*", "/oauth2/authorization")
                )
//                .sessionManagement(session -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
//                        .maximumSessions(1)
//                        .maxSessionsPreventsLogin(false)
//                )
                .headers(Customizer.withDefaults())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(customAuthenticationEntryPoint))
                .addFilterBefore(new CsrfCookieFilter(), BasicAuthenticationFilter.class)
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
            IRedisClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientService authorizedClientService) {

        OAuth2AuthorizedClientProvider authorizedClientProvider = OAuth2AuthorizedClientProviderBuilder.builder()
                .authorizationCode()
                .refreshToken(configurer -> configurer
                        .accessTokenResponseClient(refreshTokenTokenResponseClient()))
                .build();

        AuthorizedClientServiceOAuth2AuthorizedClientManager auth2AuthorizedClientManager = new AuthorizedClientServiceOAuth2AuthorizedClientManager(clientRegistrationRepository, authorizedClientService);
        auth2AuthorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);
        auth2AuthorizedClientManager.setAuthorizationSuccessHandler(oauth2AuthorizationSuccessHandler(authorizedClientService));
        auth2AuthorizedClientManager.setAuthorizationFailureHandler(oauth2AuthorizationFailureHandler());
        return auth2AuthorizedClientManager;
    }

    @Bean
    public OAuth2LoginSuccessHandler oauth2LoginSuccessHandler(ICustomOidcUserService oidcUserService, CookieUtil cookieUtil) {
        return new OAuth2LoginSuccessHandler(oidcUserService, cookieUtil);
    }

    @Bean
    public OAuth2LoginFailureHandler oauth2LoginFailureHandler() {
        return new OAuth2LoginFailureHandler();
    }

    @Bean
    public OAuth2AuthorizationSuccessHandler oauth2AuthorizationSuccessHandler(OAuth2AuthorizedClientService authorizedClientService) {
        return new com.staff_portal.backend_for_frontend.security.OAuth2AuthorizationSuccessHandler(authorizedClientService);
    }

    @Bean
    public OAuth2AuthorizationFailureHandler oauth2AuthorizationFailureHandler() {
        return new com.staff_portal.backend_for_frontend.security.OAuth2AuthorizationFailureHandler();
    }

    @Bean
    public CustomLogoutSuccessHandler customLogoutSuccessHandler(OAuth2AuthorizedClientService oAuth2AuthorizedClientService, TokenService tokenService, IRedisClientRegistrationRepository iRedisClientRegistrationRepository) {
        return new CustomLogoutSuccessHandler(iRedisClientRegistrationRepository, oAuth2AuthorizedClientService, tokenService);
    }
}
