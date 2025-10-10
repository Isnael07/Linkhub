package com.project.mylinks.infrastructure.persistency.impl;

import com.project.mylinks.domain.repository.GenericRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.function.Function;

public class GenericRepositoryImpl<T, E, ID> implements GenericRepository<T, ID> {

    private final JpaRepository<E, ID> repository;
    private final Function<T, E> toEntity;
    private final Function<E, T> toModel;

    public GenericRepositoryImpl(
            JpaRepository<E, ID> repository,
            Function<T, E> toEntity,
            Function<E, T> toModel
    ) {
        this.repository = repository;
        this.toEntity = toEntity;
        this.toModel = toModel;
    }

    @Override
    public T save(T model) {
        if (model == null) {
            throw new IllegalArgumentException("Model cannot be null");
        }
        E entity = toEntity.apply(model);
        E saved = repository.save(entity);
        return toModel.apply(saved);
    }

    @Override
    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(toModel);
    }

    @Override
    public Optional<T> findById(ID id) {
        return repository.findById(id).map(toModel);
    }

    @Override
    public void deleteById(ID id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsById(ID id) {
        return repository.existsById(id);
    }

}
