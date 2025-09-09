package com.staff_portal.auth_service.service.implementation;

import com.staff_portal.auth_service.dto.request.AuthUserRequestDTO;
import com.staff_portal.auth_service.dto.request.UserServiceStaffDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.exception.PasswordMismatchException;
import com.staff_portal.auth_service.exception.ResourceAlreadyExistsException;
import com.staff_portal.auth_service.exception.ResourceNotFoundException;
import com.staff_portal.auth_service.exception.UnAuthenticatedUserException;
import com.staff_portal.auth_service.model.users.AuthUser;
import com.staff_portal.auth_service.model.users.Role;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import com.staff_portal.auth_service.repository.RoleRepository;
import com.staff_portal.auth_service.service.interfaces.IAuthService;
import com.staff_portal.auth_service.util.DateTimeUtil;
import com.staff_portal.auth_service.util.PasswordUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Service
@Transactional
@Slf4j
public class AuthServiceImpl implements IAuthService {

    @Value("${spring.application.name}")
    private String applicationName;

    private final AuthUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestClient userServiceClient;
    private final PasswordUtil passwordUtil;
    private final DateTimeUtil dateTimeUtil;

    public AuthServiceImpl(AuthUserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           RestClient userServiceClient, PasswordUtil passwordUtil, DateTimeUtil dateTimeUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userServiceClient = userServiceClient;
        this.passwordUtil = passwordUtil;
        this.dateTimeUtil = dateTimeUtil;
    }
    
    @Override
    public AuthUser createAuthUser(AuthUserRequestDTO createUserRequest) {
        log.info("Creating auth user for email: {}", createUserRequest.getEmail());
        
        if (userRepository.existsByEmail(createUserRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("User [" + createUserRequest.getEmail() + "] already exists", HttpStatus.CONFLICT);
        }
        
        Role userRole = roleRepository.findByNameAndActiveTrue(createUserRequest.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Specified Role [" + createUserRequest.getRole() + "] is not present", HttpStatus.NOT_FOUND));
        String tempPassword = passwordUtil.generateRandomPassword();
        String encodedPassword = passwordUtil.encode(tempPassword);
        AuthUser authUser = createUserRequest.toAuthUser(encodedPassword);
        authUser.addRole(userRole);
        
        return userRepository.save(authUser);
    }
    
    @Override
    public ApiResponse<String> changePassword(String oldPassword, String newPassword) {
        String userEmail = getCurrentUserEmail();
        log.info("Changing password for user: {}", userEmail);
        
        AuthUser user = userRepository.findByEmailAndActiveTrue(userEmail)
                .orElseThrow(() -> new ResourceAlreadyExistsException("User [" + userEmail + "] already exists or In-Active", HttpStatus.NOT_FOUND));
        
        if (!passwordUtil.matches(oldPassword, user.getPassword())) {
            throw new PasswordMismatchException("old password not equal to stored password", HttpStatus.CONFLICT);
        }
        
        // Simply set the new password - Hibernate will handle the update
        user.setPassword(passwordEncoder.encode(newPassword));
        user.updatePasswordChangedAt();
        if(user.getIsFirstTimeLogin()) {
            user.setIsFirstTimeLogin(false);
        }
        userRepository.save(user);
        
        // No explicit save needed - transaction commit will trigger update
        log.info("Successfully changed password for user: {}", userEmail);
        return ApiResponse.onSuccess("Password changed successfully");
    }
    
    @Override
    public ApiResponse<String> forgotPassword(String email) {
        log.info("Processing forgot password request for email: {}", email);
        
        return userRepository.findByEmailAndActiveTrue(email)
                .map(user -> {
                    // Implement password reset logic here
                    return ApiResponse.onSuccess("Password reset instructions sent to email");
                })
                .orElseThrow(()-> new UsernameNotFoundException("Email not found"));
    }
    
    @Override
    public ApiResponse<String> createStaff(AuthUserRequestDTO createStaffRequest) {
        log.info("Creating staff member for email: {}", createStaffRequest.getEmail());

            AuthUser authUser = createAuthUser(createStaffRequest);
            createStaffRequest.setAuthUserId(authUser.getId());
            
            String bearerToken = extractBearerTokenFromContext();
            UserServiceStaffDTO staffDTO = UserServiceStaffDTO.fromAuthUserRequest(createStaffRequest);

        String userServiceResponse = userServiceClient.post()
                .uri("/api/staff")
                .header("Authorization", bearerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(staffDTO)
                .retrieve()
                .body(String.class);

        return ApiResponse.onSuccess(userServiceResponse);
    }

    public ApiResponse<String> createAdmin(AuthUserRequestDTO createAdminRequest) {
        log.info("Creating admin member fors email: {}", createAdminRequest.getEmail());
        AuthUser authUser = createAuthUser(createAdminRequest);
        createAdminRequest.setAuthUserId(authUser.getId());

        UserServiceStaffDTO adminStaffDTO = UserServiceStaffDTO.fromAuthUserRequest(createAdminRequest);

        String userServiceResponse = userServiceClient.post()
                .uri("/api/admin")
                .header("X-FORWARDED-FROM", applicationName)
                .contentType(MediaType.APPLICATION_JSON)
                .body(adminStaffDTO)
                .retrieve()
                .body(String.class);

        return ApiResponse.onSuccess(userServiceResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AuthUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnAuthenticatedUserException("No authenticated user found", HttpStatus.UNAUTHORIZED);
        }
        return authentication.getName();
    }
    
    private String extractBearerTokenFromContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return "Bearer " + jwtAuth.getToken().getTokenValue();
        }
        throw new UnAuthenticatedUserException("JWT token not found in security context", HttpStatus.UNAUTHORIZED);
    }
}
