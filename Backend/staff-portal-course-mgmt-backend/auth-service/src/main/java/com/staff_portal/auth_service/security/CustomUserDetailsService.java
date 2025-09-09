package com.staff_portal.auth_service.security;

import com.staff_portal.auth_service.model.users.AuthUser;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {
    
    private final AuthUserRepository userRepository;
    
    public CustomUserDetailsService(AuthUserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Loading user by email: {}", email);
        
        AuthUser user = userRepository.findByEmailAndActiveTrue(email.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        userRepository.flush();
        return CustomUserDetails.from(user);
    }
    
    // Only keep essential methods that are actually needed
    public CustomUserDetails loadActiveUserByEmail(String email) {
        return (CustomUserDetails) loadUserByUsername(email);
    }
}