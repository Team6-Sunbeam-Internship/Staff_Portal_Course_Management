package com.staff_portal.auth_service.initializer;

import com.staff_portal.auth_service.exception.ResourceNotFoundException;
import com.staff_portal.auth_service.model.users.*;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import com.staff_portal.auth_service.repository.RoleRepository;
import com.staff_portal.auth_service.repository.ScopeRepository;
import com.staff_portal.auth_service.util.PasswordUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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

    public AuthUserInitializer(AuthUserRepository authUserRepository, RoleRepository roleRepository, ScopeRepository scopeRepository, PasswordUtil passwordUtil) {
        this.authUserRepository = authUserRepository;
        this.roleRepository = roleRepository;
        this.scopeRepository = scopeRepository;
        this.passwordUtil = passwordUtil;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        initializeDatabse();
    }

    public void initializeDatabse() {
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
        String adminEmail = "admin@staff_portal";
        if (!authUserRepository.existsByEmail(adminEmail)) {
            Role adminRole = roleRepository
                    .findByNameAndActiveTrue(RoleType.ADMIN)
                    .orElseThrow(() -> new ResourceNotFoundException("Role Not Found", HttpStatus.NOT_FOUND));

            AuthUser adminUser = AuthUser.builder()
                    .firstName("Abhinav")
                    .email(adminEmail)
                    .password(passwordUtil.encode("admin"))
                    .active(true)
                    .roles(Set.of(adminRole))
                    .emailVerified(true)
                    .build();
            AuthUser savedUser = authUserRepository.save(adminUser);
            log.info("""
                    
                    Default Admin User Created Successfully!
                    id : {},
                    name: {},
                    email: {},
                    """, savedUser.getId(), savedUser.getFirstName(), savedUser.getEmail());
        }
    }
}