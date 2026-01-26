package com.project.mylinks.api.dto.loginDTOs;

public record LoginResponseDTO(String accessToken, String refreshToken, Long expiresIn) {
}
