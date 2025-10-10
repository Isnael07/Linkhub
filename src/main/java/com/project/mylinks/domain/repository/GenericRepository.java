package com.project.mylinks.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface GenericRepository<T, ID> {

    T save(T entity);

    Page<T> findAll(Pageable pageable);

    Optional<T> findById(ID id);

    void deleteById(ID id);

    boolean existsById(ID id);
}
