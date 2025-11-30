package com.project.mylinks.api.controller;

import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.api.dto.userDTO.UserUpdateDTO;
import com.project.mylinks.application.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> create(@RequestBody @Valid CreateUserDTO dto){
        return ResponseEntity.ok(this.service.create(dto));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<UserResponseDTO>> findALl(Pageable pageable){
        return ResponseEntity.ok(this.service.findAll(pageable));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable UUID id){
        return ResponseEntity.ok(this.service.findById(id));
    }

    @PreAuthorize("#id.toString() == authentication.principal or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        this.service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("#id.toString() == authentication.name or hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponseDTO> update(@PathVariable UUID id, @RequestBody UserUpdateDTO dto){
        return ResponseEntity.ok(this.service.update(id, dto));
    }
}
