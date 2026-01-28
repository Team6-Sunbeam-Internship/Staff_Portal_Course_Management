package com.staff_portal.auth_service.initializer;

import com.staff_portal.auth_service.dto.request.AuthUserRequestDTO;
import com.staff_portal.auth_service.dto.request.UserServiceStaffDTO;
import com.staff_portal.auth_service.model.users.*;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import com.staff_portal.auth_service.repository.RoleRepository;
import com.staff_portal.auth_service.repository.ScopeRepository;
import com.staff_portal.auth_service.service.interfaces.IAuthService;
import com.staff_portal.auth_service.util.PasswordUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class AuthUserInitializer implements ApplicationRunner {
    private final AuthUserRepository authUserRepository;
    private final RoleRepository roleRepository;
    private final ScopeRepository scopeRepository;
    private final PasswordUtil passwordUtil;
    private final IAuthService authService;
    private final RestClient userServiceClient;

    @Value("${bootstrap.admin.enabled}")
    private boolean bootstrapAdminEnabled;
    @Value("${bootstrap.admin.email}")
    private String defaultAdminEmail;
    @Value("${bootstrap.admin.password}")
    private String defaultAdminPassword;
    @Value("${bootstrap.key}")
    private String bootstrapKey;

    public AuthUserInitializer(AuthUserRepository authUserRepository, RoleRepository roleRepository, ScopeRepository scopeRepository, PasswordUtil passwordUtil, IAuthService authService, RestClient userServiceClient) {
        this.authUserRepository = authUserRepository;
        this.roleRepository = roleRepository;
        this.scopeRepository = scopeRepository;
        this.passwordUtil = passwordUtil;
        this.authService = authService;
        this.userServiceClient = userServiceClient;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        initializeDatabase();
    }

    public void initializeDatabase() {
        // Step 1: Initialize Scopes
        initializeScopes();

        // Step 2: Initialize Roles (with fresh scope references)
        initializeRoles();

        // Step 3: Update existing roles (with fresh references)
        updateExistingRoles();

        // Step 4: Create admin user
        createAdminUser();
    }

    private void initializeScopes() {
        Set<ScopeType> existingScopes = scopeRepository
                .findAll()
                .stream()
                .map(Scope::getName)
                .collect(Collectors.toSet());

        List<Scope> missingScopes = Arrays
                .stream(ScopeType.values())
                .filter(scopeType -> !existingScopes.contains(scopeType))
                .map(scopeType ->
                        Scope.builder()
                                .name(scopeType)
                                .description(scopeType.getDescription())
                                .active(true)
                                .build())
                .toList();

        if (!missingScopes.isEmpty()) {
            scopeRepository.saveAll(missingScopes);
            scopeRepository.flush();
        }
    }

    private void initializeRoles() {
        Set<RoleType> existingRoles = roleRepository
                .findAll()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        List<Role> missingRoles = Arrays
                .stream(RoleType.values())
                .filter(roleType -> !existingRoles.contains(roleType))
                .map(roleType -> {
                    // Get fresh scope references for each role
                    Set<ScopeType> requiredScopeTypes = RoleScopeMapping
                            .valueOf(roleType.name())
                            .getScopes();

                    Set<Scope> mappedScopes = new HashSet<>(scopeRepository
                            .findByNameIn(requiredScopeTypes));

                    return Role.builder()
                            .name(roleType)
                            .description(roleType.getDescription())
                            .active(true)
                            .scopes(mappedScopes)
                            .build();
                })
                .toList();

        if (!missingRoles.isEmpty()) {
            roleRepository.saveAll(missingRoles);
            roleRepository.flush();
        }
    }

    private void updateExistingRoles() {
        // Get all roles and update their scopes
        List<Role> allRoles = roleRepository.findAll();

        for (Role role : allRoles) {
            Set<ScopeType> requiredScopeTypes = RoleScopeMapping
                    .valueOf(role.getName().name())
                    .getScopes();

            // Get fresh scope references
            Set<Scope> requiredScopes = new HashSet<>(scopeRepository.findByNameIn(requiredScopeTypes));

            if (!role.getScopes().equals(requiredScopes)) {
                role.setScopes(requiredScopes);
            }
        }

        roleRepository.saveAll(allRoles);
        roleRepository.flush();
    }

    private void createAdminUser() {
        if (!bootstrapAdminEnabled) {
            log.info("Admin bootstrap disabled");
            return;
        }

        if (authUserRepository.existsByEmail(defaultAdminEmail)) {
            log.info("Admin already exists, skipping bootstrap");
            return;
        }

        // build AuthUserRequestDTO
        AuthUserRequestDTO authUserRequestDTO = AuthUserRequestDTO.builder()
                .firstName("Abhinav")
                .lastName("Mishra")
                .email(defaultAdminEmail)
                .phoneNumber("1234567890")
                .role(RoleType.ADMIN)
                .staffType("IN_HOUSE")
                .gender("MALE")
                .address("1600 Pennsylvania Avenue NW, Washington, DC 20500")
                .courseSpecialization("MULTIPLE")
                .build();

        AuthUser defaultAdmin = authService.createAuthUser(authUserRequestDTO);
        UserServiceStaffDTO staffDTO = UserServiceStaffDTO.fromAuthUserRequest(authUserRequestDTO);
        staffDTO.setAuthUserId(defaultAdmin.getId());
        userServiceClient
                .post()
                .uri("/staff/bootstrap")
                .header("X-INTERNAL-KEY", bootstrapKey)
                .body(staffDTO)
                .retrieve()
                .toBodilessEntity();
        log.info("""
                
                Default Admin User Created Successfully!
                id : {},
                name: {},
                email: {},
                """, defaultAdmin.getId(), "Abhinav Mishra", defaultAdminEmail);
    }
}