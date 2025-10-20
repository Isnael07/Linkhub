package com.project.mylinks.application.service;

import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO;
import com.project.mylinks.application.exception.LinksNotFoundException;
import com.project.mylinks.application.exception.UserNotFoundExeception;
import com.project.mylinks.domain.model.Links;
import com.project.mylinks.infrastructure.entity.LinksEntity;
import com.project.mylinks.infrastructure.entity.UserEntity;
import com.project.mylinks.infrastructure.persistency.jpa.LinksRepositoryJpa;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import com.project.mylinks.infrastructure.persistency.mapper.LinksMapper;
import com.project.mylinks.infrastructure.persistency.mapper.UserMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.project.mylinks.infrastructure.persistency.mapper.LinksMapper.*;

@Service
public class LinksService {

    private final LinksRepositoryJpa linksRepository;
    private final UserRepositoryJpa userRepository;

    public LinksService(LinksRepositoryJpa linksRepository, UserRepositoryJpa userRepository) {
        this.linksRepository = linksRepository;
        this.userRepository = userRepository;
    }


    public LinksResponseDTO create(CreateLinksDTO dto) {

        UserEntity userEntity = userRepository.findById(dto.userId())
                .orElseThrow(UserNotFoundExeception::new);


        Links domain = toDomain(dto);

        domain.setUser(UserMapper.toModel(userEntity));


        LinksEntity entity = LinksMapper.toEntity(domain);


        LinksEntity saved = linksRepository.save(entity);

        return toResponse(toModel(saved));
    }


    public Page<LinksResponseDTO> findAll(Pageable pageable) {
        return linksRepository.findAll(pageable)
                .map(entity -> toResponse(toModel(entity)));
    }


    public LinksResponseDTO findById(Long id) {
        LinksEntity entity = linksRepository.findById(id)
                .orElseThrow(LinksNotFoundException::new);
        return toResponse(toModel(entity));
    }


    public LinksResponseDTO update(Long id, LinksUpdateDTO dto) {
        LinksEntity entity = linksRepository.findById(id)
                .orElseThrow(LinksNotFoundException::new);

        Optional.ofNullable(dto.nameUrl()).ifPresent(entity::setNameUrl);
        Optional.ofNullable(dto.url()).ifPresent(entity::setUrl);

        LinksEntity updated = linksRepository.save(entity);
        return toResponse(toModel(updated));
    }

    public void delete(Long id) {
        linksRepository.deleteById(id);
    }
}
