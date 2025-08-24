package com.staff_portal.auth_service.service.implementation;

import com.staff_portal.auth_service.config.UserServiceClient;
import com.staff_portal.auth_service.dto.request.CreateAuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.exception.ResourceAlreadyExistsException;
import com.staff_portal.auth_service.exception.UserServiceException;
import com.staff_portal.auth_service.model.user.AuthUser;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import com.staff_portal.auth_service.repository.RoleRepository;
import com.staff_portal.auth_service.security.ICustomUserDetailsService;
import com.staff_portal.auth_service.service.interfaces.IAuthUserService;
import com.staff_portal.auth_service.util.DateTimeUtil;
import com.staff_portal.auth_service.util.PasswordUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthUserServiceImpl implements IAuthUserService {
    private final ICustomUserDetailsService customUserDetailsService;
    private final PasswordUtil passwordUtil;
    private final AuthUserRepository authUserRepository;
    private final RoleRepository roleRepository;
    private final DateTimeUtil dateTimeUtil;
    private final UserServiceClient userServiceClient;

    public AuthUserServiceImpl(ICustomUserDetailsService customUserDetailsService, PasswordUtil passwordUtil, AuthUserRepository authUserRepository, RoleRepository roleRepository, DateTimeUtil dateTimeUtil, UserServiceClient userServiceClient) {
        this.customUserDetailsService = customUserDetailsService;
        this.passwordUtil = passwordUtil;
        this.authUserRepository = authUserRepository;
        this.roleRepository = roleRepository;
        this.dateTimeUtil = dateTimeUtil;
        this.userServiceClient = userServiceClient;
    }

    @Override
    public ApiResponse<String> createAuthUser(CreateAuthUserRequestDTO createStaffRequest) {
        // User existence check
        if (customUserDetailsService.userExists(createStaffRequest.base().email())) {
            throw new ResourceAlreadyExistsException("User [" + createStaffRequest.base().email() + "] already exists", HttpStatus.CONFLICT);
        }
        // generate temporary password
        String tempPassword = passwordUtil.generateRandomPassword();

        // build UserDetails for creation
        UserDetails userDetails = User.withUsername(createStaffRequest.base().email())
                .password(tempPassword)
                .authorities("ROLE_" + createStaffRequest.role())
                .accountExpired(false)
                .accountLocked(false)
                .disabled(false)
                .credentialsExpired(false)
                .build();

        // persist userdetails in the db
        customUserDetailsService.createUser(userDetails);

        // load saved auth user
        AuthUser savedUser = authUserRepository.findByUsername(createStaffRequest.base().email()).orElseThrow(() -> new IllegalStateException("Saved user not found"));

        // Get Current Jwt Token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
        String bearerToken = "Bearer "+jwtAuthenticationToken.getToken().getTokenValue();

        // call user-service via rest client
        ApiResponse<String> userServiceApiResponse = userServiceClient.
                createStaffProfile(
                        createStaffRequest.base(),
                        bearerToken);

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
