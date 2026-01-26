package com.project.mylinks.infrastructure.persistency.jpa;


import com.project.mylinks.domain.model.RefreshToken;
import com.project.mylinks.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface RefreshTokenRepositoryJpa extends JpaRepository<RefreshToken, Long> {


    Optional<RefreshToken> findByTokenHash(String tokenHash);

    List<RefreshToken> findAllByUserAndRevokedFalse(User user);
}
