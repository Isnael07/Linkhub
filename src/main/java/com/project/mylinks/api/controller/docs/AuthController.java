package com.project.mylinks.api.controller.docs;

import com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO;
import com.project.mylinks.api.dto.loginDTOs.LoginResponseDTO;
import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Auth", description = "Endpoints for authentication and registration")
public interface AuthController {

    @Operation(
            summary = "Authenticate user",
            description = "Authenticates a user using email/username and password and returns a JWT token."
    )
    @ApiResponse(responseCode = "200", description = "Authentication successful")
    @ApiResponse(responseCode = "400", description = "Invalid login request")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")

    ResponseEntity<LoginResponseDTO> login(@Valid
                                           @RequestBody LoginRequestDTO login) throws Exception;

    @Operation(
            summary = "Register new user",
            description = "Creates a new user account."
    )
    @ApiResponse(responseCode = "201", description = "User successfully registered")
    @ApiResponse(responseCode = "400", description = "Invalid request data")
    @ApiResponse(responseCode = "409", description = "User already exists")

    ResponseEntity<Void> signUp(@Valid
                                @RequestBody CreateUserDTO dto);


    @Operation(
            summary = "Refresh access token",
            description = "Generates a new access token using a valid refresh token."
    )
    @ApiResponse(responseCode = "200", description = "New access token successfully generated")
    @ApiResponse(responseCode = "400", description = "Invalid refresh token request")
    @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    @ApiResponse(responseCode = "404", description = "User not found")

    ResponseEntity<LoginResponseDTO> refresh(String refreshToken);
}
