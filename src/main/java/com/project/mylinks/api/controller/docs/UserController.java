package com.project.mylinks.api.controller.docs;

import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.api.dto.userDTO.UserUpdateDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@Tag(name = "Users", description = "Endpoints for user management")
public interface UserController {

    @Operation(
            summary = "Create a new user",
            description = "Creates a new user. Only administrators are allowed to perform this operation."
    )
    @ApiResponse(responseCode = "201", description = "User successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid request data")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @ApiResponse(responseCode = "409", description = "User already exists")

    ResponseEntity<UserResponseDTO> create(@Valid
                                           @RequestBody CreateUserDTO dto);

    @Operation(
            summary = "List users",
            description = "Returns a paginated list of users. Only administrators can access this endpoint."
    )

    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")

    ResponseEntity<Page<UserResponseDTO>> findALl(
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "Find user by ID",
            description = "Returns a user by its ID. Accessible by the user himself or administrators."
    )
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @ApiResponse(responseCode = "404", description = "User not found")

    ResponseEntity<UserResponseDTO> findById(
            @Parameter(description = "User ID", required = true)
            UUID id
    );

    @Operation(
            summary = "Delete user",
            description = "Deletes a user by its ID. Accessible by the user himself or administrators."
    )

    @ApiResponse(responseCode = "204", description = "User deleted successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @ApiResponse(responseCode = "404", description = "User not found")

    ResponseEntity<Void> delete(
            @Parameter(description = "User ID", required = true)
            UUID id
    );

    @Operation(
            summary = "Update user",
            description = "Updates user data. Accessible by the user himself or administrators."
    )
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request data")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @ApiResponse(responseCode = "404", description = "User not found")
    ResponseEntity<UserResponseDTO> update(
            @Parameter(description = "User ID", required = true)
            UUID id,
            @Valid
            @RequestBody
            UserUpdateDTO dto
    );
}
