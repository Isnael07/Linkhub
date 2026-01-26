package com.project.mylinks.api.controller;


import com.project.mylinks.api.controller.docs.AuthController;
import com.project.mylinks.api.dto.loginDTOs.LoginResponseDTO;
import com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO;

import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.application.service.AuthService;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.model.UserRole;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthControllerImp implements AuthController {

    private final UserRepositoryJpa repository;

    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthService service;


    public AuthControllerImp(UserRepositoryJpa repository, BCryptPasswordEncoder passwordEncoder, AuthService service) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.service = service;
    }

    @PostMapping("/login")
    @Override
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO login) {
        try {
            return ResponseEntity.ok(service.login(login));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/signup")
    @Override
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

