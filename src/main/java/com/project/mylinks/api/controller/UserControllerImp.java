package com.project.mylinks.api.controller;

import com.project.mylinks.api.config.security.annotations.CanPermissionUser;
import com.project.mylinks.api.controller.docs.UserController;
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
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/user")
public class UserControllerImp implements UserController {

    private final UserService service;

    public UserControllerImp(UserService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public ResponseEntity<UserResponseDTO> create(@RequestBody @Valid CreateUserDTO dto){
        return ResponseEntity.ok(this.service.create(dto));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    @Override
    public ResponseEntity<Page<UserResponseDTO>> findALl(Pageable pageable){
        return ResponseEntity.ok(this.service.findAll(pageable));
    }

    @GetMapping("/{id}")
    @CanPermissionUser
    @Override
    public ResponseEntity<UserResponseDTO> findById(@PathVariable UUID id){
        return ResponseEntity.ok(this.service.findById(id));
    }

    @DeleteMapping("/{id}")
    @CanPermissionUser
    @Override
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        this.service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    @CanPermissionUser
    @Override
    public ResponseEntity<UserResponseDTO> update(@PathVariable UUID id, @RequestBody UserUpdateDTO dto){
        return ResponseEntity.ok(this.service.update(id, dto));
    }
}
