package com.staff_portal.auth_service.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.staff_portal.auth_service.model.users.AuthUser;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {
    
    private UUID id;
    private String firstName;
    private String username;
    @JsonIgnore
    private String password;
    private Boolean active;
    private Boolean emailVerified;
    private Boolean passwordChangeRequired;
    private Instant lastLoginAt;
    @JsonIgnore
    private Set<String> roles;
    @JsonIgnore
    private Set<String> scopes;
    @JsonIgnore
    private Collection<? extends GrantedAuthority> authorities;
    
    public static CustomUserDetails from(AuthUser user) {
        Set<String> roleNames = user.getRoleNames();
        Set<String> scopeNames = user.getScopeNames();
        
        Set<GrantedAuthority> authorities = new HashSet<>();
        
        // Add role authorities
        roleNames.forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role)));
        
        // Add scope authorities
        scopeNames.forEach(scope -> authorities.add(new SimpleGrantedAuthority("SCOPE_" + scope)));
        
        return CustomUserDetails.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .username(user.getEmail())
                .password(user.getPassword())
                .active(user.getActive())
                .emailVerified(user.getEmailVerified())
                .passwordChangeRequired(user.getPasswordChangeRequired())
                .lastLoginAt(user.getLastLoginAt())
                .roles(roleNames)
                .scopes(scopeNames)
                .authorities(authorities)
                .build();
    }
    
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities != null ? authorities : Collections.emptyList();
    }
    
    @Override
    @JsonIgnore
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }


    @Override
    public String toString() {
        return "CustomUserDetails{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", active=" + active +
                ", emailVerified=" + emailVerified +
                ", passwordChangeRequired=" + passwordChangeRequired +
                ", roles=" + roles +
                ", scopes=" + scopes +
                '}';
    }
}