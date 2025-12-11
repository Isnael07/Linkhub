package com.project.mylinks.api.controller;

import com.project.mylinks.api.config.security.annotations.CanPermissionLink;
import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO;
import com.project.mylinks.application.service.LinksService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/links")
public class LinksController {

    private final LinksService service;

    public LinksController(LinksService service) {
        this.service = service;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<LinksResponseDTO> create(@RequestBody @Valid CreateLinksDTO dto) {
        return ResponseEntity.ok(this.service.create(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<LinksResponseDTO>> findAll(Pageable pageable) {
        return ResponseEntity.ok(this.service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LinksResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(this.service.findById(id));
    }


    @PatchMapping("/{id}")
    @CanPermissionLink
    public ResponseEntity<LinksResponseDTO> update(@PathVariable UUID id,
                                                   @RequestBody @Valid LinksUpdateDTO dto) {
        return ResponseEntity.ok(this.service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @CanPermissionLink
    public ResponseEntity<Void> deleteById(@PathVariable UUID id){
        this.service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{id}/links")
    @CanPermissionLink
    public ResponseEntity<List<LinksResponseDTO>> findAllLinksByUser(@PathVariable UUID id){
        List<LinksResponseDTO> links = service.findAllLinksByUserId(id);
        return ResponseEntity.ok(links);
    }
}
