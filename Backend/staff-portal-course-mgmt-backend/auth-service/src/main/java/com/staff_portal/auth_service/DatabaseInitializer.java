package com.staff_portal.auth_service;

import com.staff_portal.auth_service.model.user.*;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import com.staff_portal.auth_service.repository.RoleRepository;
import com.staff_portal.auth_service.repository.ScopeRepository;
import com.staff_portal.auth_service.util.PasswordUtil;
import jakarta.transaction.Transactional;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DatabaseInitializer implements ApplicationRunner {
    private final AuthUserRepository authUserRepository;
    private final RoleRepository roleRepository;
    private final ScopeRepository scopeRepository;
    private final PasswordUtil passwordUtil;
    public DatabaseInitializer(AuthUserRepository authUserRepository, RoleRepository roleRepository, ScopeRepository scopeRepository, PasswordUtil passwordUtil) {
        this.authUserRepository = authUserRepository;
        this.roleRepository = roleRepository;
        this.scopeRepository = scopeRepository;
        this.passwordUtil = passwordUtil;
    }


    @Override
    @Transactional
    public void run(ApplicationArguments args) {

        // Check if all scopes already exist
        boolean allScopesExist = Arrays.stream(ScopeName.values())
                .allMatch(scopeRepository::existsByName);

        Set<Scope> scopes = new HashSet<>();
        if (!allScopesExist) {
            // Create Scopes only if some are missing
            scopes = Arrays.stream(ScopeName.values())
                    .filter(scopeName -> !scopeRepository.existsByName(scopeName))
                    .map(scopeName -> Scope.builder()
                            .name(scopeName)
                            .createdAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                            .updatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                            .build())
                    .collect(Collectors.toSet());
            scopeRepository.saveAll(scopes);
        }
        // Retrieve all scopes (existing or newly created)
        scopes.addAll(scopeRepository.findAll());

        // Check if all roles exist
        boolean allRolesExist = Arrays.stream(RoleName.values())
                .allMatch(roleName -> roleRepository.existsByName(roleName));

        if (!allRolesExist) {
            // Create Roles
            Role adminRole;
            if (!roleRepository.existsByName(RoleName.ADMIN)) {
                adminRole = Role.builder()
                        .name(RoleName.ADMIN)
                        .scopes(scopes)
                        .createdAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .updatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .build();
            } else {
                adminRole = roleRepository.findByName(RoleName.ADMIN).orElseThrow();
            }

            // Course_Coordinator Scopes
            Set<Scope> cocoScopes = scopes.stream()
                    .filter(scope -> scope.getName().name().contains("COURSE") ||
                            scope.getName().name().contains("MODULE") ||
                            scope.getName().name().contains("SUBJECT") ||
                            scope.getName().name().contains("SECTION") ||
                            scope.getName().name().contains("TOPIC") ||
                            scope.getName().name().contains("SCHEDULE"))
                    .collect(Collectors.toSet());

            Role coCoordinatorRole;
            if (!roleRepository.existsByName(RoleName.COURSE_COORDINATOR)) {
                coCoordinatorRole = Role.builder()
                        .name(RoleName.COURSE_COORDINATOR)
                        .scopes(cocoScopes)
                        .createdAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .updatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .build();
            } else {
                coCoordinatorRole = roleRepository.findByName(RoleName.COURSE_COORDINATOR).orElseThrow();
            }

            // General_User Scopes
            Set<Scope> generalUserScopes = scopes.stream()
                    .filter(scope -> scope.getName().name().contains("SESSION") ||
                            scope.getName().name().contains("VIDEO") ||
                            scope.getName().name().contains("TIMESHEET"))
                    .collect(Collectors.toSet());

            Role generalRole;
            if (!roleRepository.existsByName(RoleName.GENERAL_USER)) {
                generalRole = Role.builder()
                        .name(RoleName.GENERAL_USER)
                        .scopes(generalUserScopes)
                        .createdAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .updatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .build();
            } else {
                generalRole = roleRepository.findByName(RoleName.GENERAL_USER).orElseThrow();
            }

            roleRepository.saveAll(List.of(adminRole, coCoordinatorRole, generalRole));
        }

        // Check if all users exist
        String[] usernames = {"admin@example.com", "coordinator@example.com", "user@example.com"};
        boolean allUsersExist = Arrays.stream(usernames)
                .allMatch(authUserRepository::existsByUsername);

        if (!allUsersExist) {
            // Create Users
            if (!authUserRepository.existsByUsername("admin@example.com")) {
                Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElseThrow();
                AuthUser adminUser = AuthUser.builder()
                        .username("admin@example.com")
                        .password(passwordUtil.encode("admin"))
                        .roles(Set.of(adminRole))
                        .createdAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .updatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .build();
                authUserRepository.save(adminUser);
            }

            if (!authUserRepository.existsByUsername("coordinator@example.com")) {
                Role coCoordinatorRole = roleRepository.findByName(RoleName.COURSE_COORDINATOR).orElseThrow();
                AuthUser coordinatorUser = AuthUser.builder()
                        .username("coordinator@example.com")
                        .password(passwordUtil.encode("coordinator"))
                        .roles(Set.of(coCoordinatorRole))
                        .createdAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .updatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .build();
                authUserRepository.save(coordinatorUser);
            }

            if (!authUserRepository.existsByUsername("user@example.com")) {
                Role generalRole = roleRepository.findByName(RoleName.GENERAL_USER).orElseThrow();
                AuthUser generalUser = AuthUser.builder()
                        .username("user@example.com")
                        .password(passwordUtil.encode("user"))
                        .roles(Set.of(generalRole))
                        .createdAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .updatedAt(LocalDateTime.now(ZoneId.of("Asia/Kolkata")))
                        .build();
                authUserRepository.save(generalUser);
            }
        }
    }
}
