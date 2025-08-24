package com.staff_portal.auth_service.security;

import com.staff_portal.auth_service.exception.PasswordMismatchException;
import com.staff_portal.auth_service.model.user.AuthUser;
import com.staff_portal.auth_service.model.user.Role;
import com.staff_portal.auth_service.model.user.RoleName;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import com.staff_portal.auth_service.util.DateTimeUtil;
import com.staff_portal.auth_service.util.PasswordUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class CustomUserDetailsServiceImpl implements ICustomUserDetailsService {
    private final AuthUserRepository authUserRepository;
    private final DateTimeUtil dateTimeUtil;
    private final PasswordUtil passwordUtil;

    public CustomUserDetailsServiceImpl(AuthUserRepository authUserRepository, DateTimeUtil dateTimeUtil, PasswordUtil passwordUtil) {
        this.authUserRepository = authUserRepository;
        this.dateTimeUtil = dateTimeUtil;
        this.passwordUtil = passwordUtil;
    }

    // ---------------- UserDetailsService ----------------
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AuthUser authUser = authUserRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username: ["+username + "] not found" ));

        return new CustomUserDetails(authUser);
    }

    @Override
    public void createUser(UserDetails user) {
        AuthUser authUser = AuthUser.builder()
                .username(user.getUsername())
                .password(passwordUtil.encode(user.getPassword()))
                .roles(user
                        .getAuthorities()
                        .stream()
                        .map(grantedAuthority ->
                                Role.builder()
                                        .name(RoleName.valueOf(grantedAuthority.getAuthority().substring("ROLE_".length())))
                                        .build()
                        ).collect(Collectors.toSet())
                )
                .build();
        authUserRepository.save(authUser);
    }

    @Override
    public void updateUser(UserDetails user) {
        AuthUser existingUser = authUserRepository.findByUsername(user.getUsername()).orElseThrow(() -> new UsernameNotFoundException(user.getUsername()));

        // Update password if provided
        if(user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(passwordUtil.encode(user.getPassword()));
        }
        existingUser.setUpdatedAt(dateTimeUtil.getDateTime());
        authUserRepository.save(existingUser);
    }

    @Override
    public void deleteUser(String username) {
        authUserRepository.findByUsername(username).ifPresent(authUserRepository::delete);
    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {
        log.info("Changing password from {} to {}", oldPassword, newPassword);
        // change password for currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth == null) throw new IllegalStateException("No authenticated user found");
        String username = auth.getName();
        AuthUser authUser = authUserRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        if(!passwordUtil.matches(oldPassword, authUser.getPassword())) {
            throw new PasswordMismatchException("old password not equal to stored password", HttpStatus.CONFLICT);
        }
        authUser.setPassword(passwordUtil.encode(newPassword));
        authUser.setUpdatedAt(dateTimeUtil.getDateTime());
        authUserRepository.save(authUser);
        log.info("Password changed from {} to {}", oldPassword, newPassword);
    }

    @Override
    public boolean userExists(String username) {
        return authUserRepository.existsByUsername(username);
    }
}
