package com.project.mylinks.api.controller;


import com.project.mylinks.api.dto.loginDTOs.LoginResponseDTO;
import com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO;

import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.model.UserRole;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthController {

    private final JwtEncoder jwtEncoder;
    private final UserRepositoryJpa repository;

    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(JwtEncoder jwtEncoder, UserRepositoryJpa repository, BCryptPasswordEncoder passwordEncoder) {
        this.jwtEncoder = jwtEncoder;
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO login) {
        Optional<User> user = repository.findByEmail(login.email());

        if (user.isEmpty() || !user.get().isLoginCorrect(login.password(), passwordEncoder)) {
            throw new BadCredentialsException("user or password is invalid");
        }

        Instant now = Instant.now();
        long expiresIn = 300L;

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("my-links-v0")
                .subject(user.get().getId().toString())
                .claim("roles", List.of("ROLE_" + user.get().getRole().name()))
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiresIn))
                .build();

        String jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return ResponseEntity.ok(new LoginResponseDTO(jwtValue, expiresIn));
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(@RequestBody CreateUserDTO dto){
        if (repository.findByEmail(dto.email()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        User user = new User();
        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(UserRole.USER);

        repository.save(user);

        return ResponseEntity.ok().build();
    }
}

