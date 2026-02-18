package com.project.mylinks.application.service;

import com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO;
import com.project.mylinks.api.dto.loginDTOs.LoginResponseDTO;
import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.application.domain.policy.RefreshTokenPolicy;
import com.project.mylinks.application.domain.service.PasswordService;
import com.project.mylinks.application.domain.service.TokenService;
import com.project.mylinks.application.exception.EmailAlreadyUseException;
import com.project.mylinks.application.exception.UserNotFoundException;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import static com.project.mylinks.infrastructure.persistency.mapper.UserMapper.toEntity;

@Service
public class AuthService {

    private final UserRepositoryJpa repository;
    private final TokenService tokenService;
    private final PasswordService passwordService;
    private final RefreshTokenPolicy refreshTokenPolicy;

    public AuthService(UserRepositoryJpa repository,
                       TokenService tokenService,
                       PasswordService passwordService,
                       RefreshTokenPolicy refreshTokenPolicy) {
        this.repository = repository;
        this.tokenService = tokenService;
        this.passwordService = passwordService;
        this.refreshTokenPolicy = refreshTokenPolicy;
    }

    public LoginResponseDTO login(LoginRequestDTO login) {

        User user = repository.findByEmail(login.email())
                .filter(u -> passwordService.matches(login.password(), u.getPassword()))
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        user.rotateRefreshTokenIfNeeded(refreshTokenPolicy, tokenService);

        repository.save(user);

        String accessToken = tokenService.generateAccessToken(user);

        return new LoginResponseDTO(
                accessToken,
                user.getRefreshToken(),
                300L
        );
    }

    public void signUp(CreateUserDTO dto) {
        if (repository.existsByEmail(dto.email()))
            throw new EmailAlreadyUseException();

        User user = toEntity(dto);
        user.setPassword(passwordService.encode(user.getPassword()));

        repository.save(user);
    }

    public LoginResponseDTO refresh(String refreshToken) {

        User user = repository.findByRefreshToken(refreshToken)
                .orElseThrow(UserNotFoundException::new);

        user.rotateRefreshTokenIfNeeded(refreshTokenPolicy, tokenService);

        repository.save(user);

        String accessToken = tokenService.generateAccessToken(user);

        return new LoginResponseDTO(
                accessToken,
                user.getRefreshToken(),
                300L
        );
    }

}
