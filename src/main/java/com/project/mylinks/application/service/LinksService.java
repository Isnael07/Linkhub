package com.project.mylinks.application.service;

import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO;
import com.project.mylinks.application.exception.LinksNotFoundException;
import com.project.mylinks.application.exception.UserNotFoundExeception;
import com.project.mylinks.domain.model.Links;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.repository.GenericRepository;
import com.project.mylinks.infrastructure.persistency.mapper.LinksMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

import static com.project.mylinks.infrastructure.persistency.mapper.LinksMapper.toDomain;
import static com.project.mylinks.infrastructure.persistency.mapper.LinksMapper.toResponse;

@Service
public class LinksService {

    private final GenericRepository<Links, Long> linksRepository;
    private final GenericRepository<User, UUID> userRepository;

    public LinksService(
            GenericRepository<Links, Long> linksRepository,
            GenericRepository<User, UUID> userRepository
    ) {
        this.linksRepository = linksRepository;
        this.userRepository = userRepository;
    }

    public LinksResponseDTO create(CreateLinksDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(UserNotFoundExeception::new);

        Links link = toDomain(dto);
        link.setUser(user);

        Links saved = linksRepository.save(link);
        return toResponse(saved);
    }

    public Page<LinksResponseDTO> findAll(Pageable pageable) {
        return linksRepository.findAll(pageable)
                .map(LinksMapper::toResponse);
    }

    public LinksResponseDTO findById(Long id) {
        return linksRepository.findById(id)
                .map(LinksMapper::toResponse)
                .orElseThrow(LinksNotFoundException::new);
    }

    public LinksResponseDTO update(Long id, LinksUpdateDTO dto) {
        Links exists = linksRepository.findById(id)
                .orElseThrow(LinksNotFoundException::new);

        Optional.ofNullable(dto.nameUrl()).ifPresent(exists::setNameUrl);
        Optional.ofNullable(dto.url()).ifPresent(exists::setUrl);

        Links updated = linksRepository.save(exists);
        return toResponse(updated);
    }

    public void delete(Long id) {
        linksRepository.deleteById(id);
    }
}
