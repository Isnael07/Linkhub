package com.project.mylinks.api.controller;


import com.project.mylinks.api.controller.docs.AuthController;
import com.project.mylinks.api.dto.loginDTOs.LoginResponseDTO;
import com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO;

import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.application.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthControllerImp implements AuthController {

    private final AuthService service;

    public AuthControllerImp(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    @Override
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO login) {

        return ResponseEntity.ok(service.login(login));
    }

    @PostMapping("/signup")
    @Override
    public ResponseEntity<Void> signUp(@RequestBody @Valid CreateUserDTO dto){
        service.signUp(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh/{refreshToken}")
    @Override
    public ResponseEntity<LoginResponseDTO> refresh(@PathVariable String refreshToken) {
        var response = service.refresh(refreshToken);
        return ResponseEntity.ok(response);
    }

}
