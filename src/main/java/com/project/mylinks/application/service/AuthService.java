package com.project.mylinks.application.service;

import com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO;
import com.project.mylinks.api.dto.loginDTOs.LoginResponseDTO;
import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.application.exception.EmailAlreadyUseException;
import com.project.mylinks.application.exception.UserNotFoundException;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

import static com.project.mylinks.infrastructure.persistency.mapper.UserMapper.toEntity;

@Service
public class AuthService {

    private final UserRepositoryJpa repository;
    private final JwtEncoder jwtEncoder;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepositoryJpa repository, JwtEncoder jwtEncoder, BCryptPasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.jwtEncoder = jwtEncoder;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO login) {

        User user = authenticate(login);
        String accessToken = generateAccessToken(user);

        return new LoginResponseDTO(
                accessToken,
                user.getRefreshToken(),
                300L
        );
    }

    public void signUp(CreateUserDTO dto){
        if (repository.existsByEmail(dto.email())) throw new EmailAlreadyUseException();
        User user = toEntity(dto);
        var encode = passwordEncoder.encode(user.getPassword());
        user.setPassword(encode);
        String hashToken = UUID.randomUUID().toString();
        user.setRefreshToken(hashToken);

        repository.save(user);
    }


    private User authenticate(LoginRequestDTO login){
        return repository.findByEmail(login.email())
                .filter(user -> user.isLoginCorrect(login.password(), passwordEncoder))
                .orElseThrow(() -> new BadCredentialsException("erro"));
    }

    private String generateAccessToken(User user){
        Instant now = Instant.now();
        long expiresIn = 300L;

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("links-hub-v0")
                .subject(user.getId().toString())
                .claim("roles", List.of("ROLE_" + user.getRole().name()))
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiresIn))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

     public LoginResponseDTO refresh(String refreshToken){

         User user = repository.findByRefreshToken(refreshToken)
                 .orElseThrow(UserNotFoundException::new);

         String hashToken = hash(UUID.randomUUID().toString());
         user.setRefreshToken(hashToken);

        repository.save(user);

        var accessToken = generateAccessToken(user);

        return new LoginResponseDTO(
                 accessToken,
                 user.getRefreshToken(),
                 300L
         );

     }

    private String hash(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("erro", e);
        }
    }

    
}
