package com.staff_portal.auth_service.model.users;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "auth_users", indexes = {
    @Index(name = "idx_auth_user_email", columnList = "email"),
    @Index(name = "idx_auth_user_active", columnList = "active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class AuthUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;
    
    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private Boolean emailVerified = false;
    
    @Column(name = "password_change_required", nullable = false)
    @Builder.Default
    private Boolean passwordChangeRequired = false;
    
    @Column(name = "last_login_at")
    private Instant lastLoginAt;
    
    @Column(name = "password_changed_at")
    private Instant passwordChangedAt;
    
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.REFRESH, CascadeType.MERGE})
    @JoinTable(
        name = "auth_user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"),
        indexes = {
            @Index(name = "idx_user_roles_user", columnList = "user_id"),
            @Index(name = "idx_user_roles_role", columnList = "role_id")
        }
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "is_first_time_login")
    @Builder.Default
    private Boolean isFirstTimeLogin = true;

    @Version
    @Column(name = "version")
    private Long version;
    
    // Helper methods
    public void addRole(Role role) {
        this.roles.add(role);
    }
    
    public Set<Scope> getAllScopes() {
        return roles.stream()
                .flatMap(role -> role.getScopes().stream())
                .collect(Collectors.toSet());
    }
    
    public Set<String> getScopeNames() {
        return getAllScopes().stream()
                .map(scope -> scope.getName().name())
                .collect(Collectors.toSet());
    }
    
    public Set<String> getRoleNames() {
        return roles.stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
    }
    
    public void updatePasswordChangedAt() {
        this.passwordChangedAt = Instant.now(Clock.system(ZoneId.of("Asia/Kolkata")));
        this.passwordChangeRequired = false;
    }
}