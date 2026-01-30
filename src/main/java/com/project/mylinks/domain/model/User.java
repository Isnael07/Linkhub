package com.project.mylinks.domain.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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

    public boolean isLoginCorrect(String password, BCryptPasswordEncoder passwordEncoder) {
        return passwordEncoder.matches(password, this.password);
    }
}
