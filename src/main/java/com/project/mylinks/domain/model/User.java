package com.project.mylinks.domain.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.project.mylinks.application.domain.policy.RefreshTokenPolicy;
import com.project.mylinks.application.domain.service.TokenService;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID id;
    @Column(unique = true)
    private String username;
    private String password;
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Links> links;

    @Enumerated(EnumType.STRING)
    @Column(name = "cargo", nullable = false)
    private UserRole role;

    private String refreshToken;

    private Instant createdTokenAt;


    public void rotateRefreshTokenIfNeeded(RefreshTokenPolicy policy,
                                           TokenService tokenService) {

        if (policy.needsNew(this)) {
            this.refreshToken = tokenService.generateRefreshToken();
            this.createdTokenAt = Instant.now();
        }
    }

}
