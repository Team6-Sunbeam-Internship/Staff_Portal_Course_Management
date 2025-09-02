package com.staff_portal.auth_service.service.implementation;

import com.staff_portal.auth_service.dto.request.CreateAuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.exception.ResourceAlreadyExistsException;
import com.staff_portal.auth_service.exception.UserServiceException;
import com.staff_portal.auth_service.model.user.AuthUser;
import com.staff_portal.auth_service.model.user.Role;
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
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.util.Set;
import java.util.UUID;

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
    public UUID createAuthUser(CreateAuthUserRequestDTO createStaffRequest) {
        // User existence check
        if (customUserDetailsService.userExists(createStaffRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("User [" + createStaffRequest.getEmail() + "] already exists", HttpStatus.CONFLICT);
        }
        // Role existence check
        Role role = roleRepository.findByName(createStaffRequest.getRole()).orElseThrow(() -> new ResourceNotFoundException("Specified Role [" + createStaffRequest.getRole() + "] is not present", HttpStatus.NOT_FOUND));
        // generate temporary password
        String tempPassword = passwordUtil.generateRandomPassword();

        // build User for creation
        AuthUser unSavedUser = AuthUser.builder()
                .firstName(createStaffRequest.getFirstName())
                .email(createStaffRequest.getEmail())
                .password(passwordUtil.encode(tempPassword))
                .roles(Set.of(role))
                .updatedAt(dateTimeUtil.getDateTime())
                .build();

        // persist userdetails in the db
        AuthUser savedAuthUser = authUserRepository.save(unSavedUser);
        // create req dto for user-service
        return savedAuthUser.getId();
    }

    @Override
    public ApiResponse<String> createStaff(CreateAuthUserRequestDTO createStaffRequest) {
        // Get Current Jwt Token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt =  (Jwt)authentication.getPrincipal();
        String bearerToken = "Bearer " + jwt.getTokenValue();


        // call user-service via rest client and include the createStaffRequest in the post body
        ApiResponse<String> userServiceApiResponse = userServiceRestClient
                .post()
                .uri(URI.create("/staff/create"))
                .header("Authorization", bearerToken)
                .header("X-Internal-Call", "__auth-server")
                .contentType(MediaType.APPLICATION_JSON)
                .body(createStaffRequest)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        // Check if the user service call was successful
        assert userServiceApiResponse != null;
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
