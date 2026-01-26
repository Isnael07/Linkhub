package com.project.mylinks.application.service;


import com.project.mylinks.api.dto.RefreshTokenResult;
import com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO;
import com.project.mylinks.api.dto.loginDTOs.LoginResponseDTO;
import com.project.mylinks.domain.model.RefreshToken;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.infrastructure.persistency.jpa.RefreshTokenRepositoryJpa;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepositoryJpa repository;
    private final JwtEncoder jwtEncoder;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RefreshTokenRepositoryJpa refreshTokenRepository;

    public AuthService(UserRepositoryJpa repository, JwtEncoder jwtEncoder, BCryptPasswordEncoder passwordEncoder, RefreshTokenRepositoryJpa refreshTokenRepository) {
        this.repository = repository;
        this.jwtEncoder = jwtEncoder;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public LoginResponseDTO login(LoginRequestDTO login) throws Exception {

        User user = authenticate(login);
        String accessToken = generateAccessToken(user);
        RefreshTokenResult refresh = generateRefreshToken(user);

        return new LoginResponseDTO(
                accessToken,
                refresh.rawToken(),
                300L
        );
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
                .issuer("my-links-v0")
                .subject(user.getId().toString())
                .claim("roles", List.of("ROLE_" + user.getRole().name()))
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiresIn))
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    private RefreshTokenResult generateRefreshToken(User user) throws Exception {
        String raw = UUID.randomUUID().toString();

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(user);
        refreshToken.setTokenHash(hash(raw));
        refreshToken.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));

        refreshTokenRepository.save(refreshToken);

        return new RefreshTokenResult(raw);
    }

    private String hash(String raw) throws Exception{
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(raw.getBytes(StandardCharsets.UTF_8));

        return HexFormat.of().formatHex(hashBytes);
    }
}
