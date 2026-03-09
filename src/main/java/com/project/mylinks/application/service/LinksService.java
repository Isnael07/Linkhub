package com.project.mylinks.application.service;

import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO;
import com.project.mylinks.application.exception.LinksNotFoundException;
import com.project.mylinks.application.exception.UserNotFoundException;
import com.project.mylinks.domain.model.Links;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.infrastructure.persistency.jpa.LinksRepositoryJpa;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import com.project.mylinks.infrastructure.persistency.mapper.LinksMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.project.mylinks.infrastructure.persistency.mapper.LinksMapper.toEntity;
import static com.project.mylinks.infrastructure.persistency.mapper.LinksMapper.toResponse;

@Service
@Transactional
public class LinksService {

    private final LinksRepositoryJpa linksRepository;
    private final UserRepositoryJpa userRepository;

    public LinksService(LinksRepositoryJpa linksRepository, UserRepositoryJpa userRepository) {
        this.linksRepository = linksRepository;
        this.userRepository = userRepository;
    }

    @CacheEvict(cacheNames = "user_links", key = "#dto.userId()")
    public LinksResponseDTO create(CreateLinksDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(UserNotFoundException::new);

        Links link = toEntity(dto, user);
        linksRepository.save(link);

        return toResponse(link);
    }

    @Transactional(readOnly = true)
    public Page<LinksResponseDTO> findAll(Pageable pageable) {
        return linksRepository.findAll(pageable)
                .map(LinksMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public LinksResponseDTO findById(UUID id) {
        Links link = linksRepository.findById(id)
                .orElseThrow(LinksNotFoundException::new);
        return toResponse(link);
    }

    public LinksResponseDTO update(UUID id, LinksUpdateDTO dto) {
        Links link = linksRepository.findById(id)
                .orElseThrow(LinksNotFoundException::new);

        if (dto.nameUrl() != null) link.setNameUrl(dto.nameUrl());
        if (dto.url() != null) link.setUrl(dto.url());

        linksRepository.save(link);
        return toResponse(link);
    }

    public void delete(UUID id) {
        if (!linksRepository.existsById(id)) {
            throw new LinksNotFoundException();
        }
        linksRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public UUID findOwnerId(UUID id){
        return linksRepository.findById(id)
                .map(links -> links.getUser().getId())
                .orElseThrow(UserNotFoundException::new
        );
    }
    @Transactional(readOnly = true)
    public List<LinksResponseDTO> findAllLinksByUsername(String username){
        List<Links> links = linksRepository.findByUserUsername(username);

        if(links.isEmpty()) throw new LinksNotFoundException();

        return links.stream()
              .map(LinksMapper::toResponse)
              .toList();
    }

}
