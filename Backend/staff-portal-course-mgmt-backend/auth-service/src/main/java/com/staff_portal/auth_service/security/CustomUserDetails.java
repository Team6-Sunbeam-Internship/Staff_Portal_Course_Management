package com.staff_portal.auth_service.security;

import com.fasterxml.jackson.annotation.*;
import com.staff_portal.auth_service.model.user.AuthUser;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@JsonTypeName("CustomUserDetails")
@JsonTypeInfo(include = JsonTypeInfo.As.PROPERTY, use = JsonTypeInfo.Id.NAME)
@Getter
@Setter
@NoArgsConstructor // This is crucial for Jackson deserialization
@AllArgsConstructor
@Builder
public class CustomUserDetails implements UserDetails {

    @JsonProperty("authUser")
    @JsonIgnore // Ignore during serialization to prevent lazy loading issues
    private AuthUser authUser;

    @JsonProperty("authorities")
    private Set<GrantedAuthority> authorities;

    // Store basic user info for serialization
    @JsonProperty("username")
    private String username;  // store the email(used for login)

    @JsonProperty("password")
    @JsonIgnore // Don't serialize password for security
    private String password;

    @JsonProperty("userId")
    private UUID userId; // Store the user ID for JWT 'sub' claim

    @JsonProperty("email")
    private String email; // Store email for JWT claims

    @JsonProperty("firstName")
    private String firstName; // Store firstName for ID token

    @JsonCreator
    public CustomUserDetails(@JsonProperty("authorities") Set<GrantedAuthority> authorities,
                             @JsonProperty("username") String username) {
        this.authorities = authorities;
        this.username = username;
    }

    // Constructor for creating from AuthUser
    public CustomUserDetails(AuthUser authUser) {
        this.authUser = authUser;
        this.username = authUser.getEmail();
        this.password = authUser.getPassword();
        this.authorities = mapToGrantedAuthorities(authUser);
        this.userId = authUser.getId();
        this.firstName = authUser.getFirstName();
    }

    private Set<GrantedAuthority> mapToGrantedAuthorities(AuthUser authUser) {
        if (authUser == null || authUser.getRoles() == null) {
            return Set.of();
        }

        return authUser.getRoles().stream()
                .flatMap(role -> {
                    // Authorities for ROLE_ + role
                    Stream<GrantedAuthority> roleAuthorities = Stream.of(new SimpleGrantedAuthority("ROLE_" + role.getName()));

                    // Authorities for SCOPE_ + scopes of the role
                    Stream<GrantedAuthority> scopeAuthorities = role.getScopes().stream()
                            .map(scope -> new SimpleGrantedAuthority("SCOPE_" + scope.getName()));
                    return Stream.concat(roleAuthorities, scopeAuthorities);
                })
                .collect(Collectors.toSet());
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}