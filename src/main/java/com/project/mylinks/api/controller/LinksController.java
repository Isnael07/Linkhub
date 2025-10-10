package com.project.mylinks.api.controller;


import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO;
import com.project.mylinks.application.service.LinksService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/links")
public class LinksController {

    private final LinksService service;

    public LinksController(LinksService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LinksResponseDTO> create(@RequestBody @Valid CreateLinksDTO dto) {
        return ResponseEntity.ok(this.service.create(dto));
    }

    @GetMapping
    public ResponseEntity<Page<LinksResponseDTO>> findAll(Pageable pageable) {
        return ResponseEntity.ok(this.service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LinksResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(this.service.findById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LinksResponseDTO> update(@PathVariable Long id,
                                                   @RequestBody @Valid LinksUpdateDTO dto) {
        return ResponseEntity.ok(this.service.update(id, dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id){
        this.service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
