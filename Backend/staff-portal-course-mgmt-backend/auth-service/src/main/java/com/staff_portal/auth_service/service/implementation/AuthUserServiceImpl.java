package com.staff_portal.auth_service.service.implementation;

import com.staff_portal.auth_service.dto.request.CreateAuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.exception.ResourceAlreadyExistsException;
import com.staff_portal.auth_service.exception.UserServiceException;
import com.staff_portal.auth_service.model.user.AuthUser;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import com.staff_portal.auth_service.repository.RoleRepository;
import com.staff_portal.auth_service.security.CustomUserDetails;
import com.staff_portal.auth_service.security.ICustomUserDetailsService;
import com.staff_portal.auth_service.service.interfaces.IAuthUserService;
import com.staff_portal.auth_service.util.DateTimeUtil;
import com.staff_portal.auth_service.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.util.Set;

@Service
@Transactional
public class AuthUserServiceImpl implements IAuthUserService {
    private final ICustomUserDetailsService customUserDetailsService;
    private final PasswordUtil passwordUtil;
    private final AuthUserRepository authUserRepository;
    private final RoleRepository roleRepository;
    private final DateTimeUtil dateTimeUtil;
    private final RestClient userServiceRestClient;

    public AuthUserServiceImpl(ICustomUserDetailsService customUserDetailsService, PasswordUtil passwordUtil, AuthUserRepository authUserRepository, RoleRepository roleRepository, DateTimeUtil dateTimeUtil, @Qualifier("userServiceRestClient") RestClient userServiceRestClient) {
        this.customUserDetailsService = customUserDetailsService;
        this.passwordUtil = passwordUtil;
        this.authUserRepository = authUserRepository;
        this.roleRepository = roleRepository;
        this.dateTimeUtil = dateTimeUtil;
        this.userServiceRestClient = userServiceRestClient;
    }

    @Override
    public ApiResponse<String> createAuthUser(CreateAuthUserRequestDTO createStaffRequest) {
        // User existence check
        if (customUserDetailsService.userExists(createStaffRequest.email())) {
            throw new ResourceAlreadyExistsException("User with [" + createStaffRequest.email() + "] already exists", HttpStatus.CONFLICT);
        }
        // generate temporary password
        String tempPassword = passwordUtil.generateRandomPassword();

        // build UserDetails for creation
        CustomUserDetails userDetails = CustomUserDetails.builder()
                .username(createStaffRequest.email())
                .password(tempPassword)
                .authorities(Set.of(new SimpleGrantedAuthority("ROLE_"+createStaffRequest.role())))
                .build();

        // persist userdetails in the db
        customUserDetailsService.createUser(userDetails);

        // load saved auth user
        AuthUser savedUser = authUserRepository.findByUsername(createStaffRequest.email()).orElseThrow(() -> new IllegalStateException("Saved user not found"));

        // Get Current Jwt Token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
        String bearerToken = "Bearer "+jwtAuthenticationToken.getToken().getTokenValue();

        // call user-service via rest client
        ApiResponse<String> userServiceApiResponse = userServiceRestClient
                .post()
                .uri(URI.create("/staff/create"))
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<String>>(){});

        // Check if the user service call was successful
        if (!userServiceApiResponse.isSuccess()) {
            throw new UserServiceException("User service failed: " + userServiceApiResponse.getError(),
                    HttpStatusCode.valueOf(500));
        }

        // Return success response wrapped in ApiResponse
        return ApiResponse.onSuccess(userServiceApiResponse.getApiResponse());
    }

    @Override
    public void forgotPassword(String email) {

    }

    @Override
    public ApiResponse<String> changePassword(String oldPassword, String newPassword) {
        customUserDetailsService.changePassword(oldPassword, newPassword);
        return ApiResponse.onSuccess("Password changed successfully");
    }
}
