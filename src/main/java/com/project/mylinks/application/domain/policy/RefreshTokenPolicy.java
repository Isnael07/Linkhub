package com.project.mylinks.application.domain.policy;


import com.project.mylinks.domain.model.User;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class RefreshTokenPolicy {

    public boolean needsNew(User user) {
        return user.getRefreshToken() == null ||
                user.getCreatedTokenAt().isBefore(
                        Instant.now().minus(15, ChronoUnit.DAYS)
                );
    }

}
