package com.project.mylinks.api.controller.docs;


import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

@Tag(name = "links", description = "Endpoints for link management")
public interface LinkController {

    @Operation(
            summary = "Create a new link",
            description = "Creates a new link associated with the authenticated user."
    )
    @ApiResponse(responseCode = "201", description = "Link successfully created")
    @ApiResponse(responseCode = "400", description = "Invalid request data")
    @ApiResponse(responseCode = "403", description = "Access denied")
    ResponseEntity<LinksResponseDTO> create(CreateLinksDTO dto);

    @Operation(
            summary = "List all links",
            description = "Returns a paginated list of links. Administrators can view all links."
    )
    @ApiResponse(responseCode = "200", description = "Links retrieved successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")

    ResponseEntity<Page<LinksResponseDTO>> findALl(
            @ParameterObject Pageable pageable
    );

    @Operation(
            summary = "Find link by ID",
            description = "Returns a link by its ID. Accessible by the owner or administrators."
    )
    @ApiResponse(responseCode = "200", description = "Link found")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @ApiResponse(responseCode = "404", description = "Link not found")

    ResponseEntity<LinksResponseDTO> findById(
            @Parameter(description = "Link ID", required = true)
            UUID id
    );

    @Operation(
            summary = "Delete link",
            description = "Deletes a link by its ID. Accessible by the owner or administrators."
    )
    @ApiResponse(responseCode = "204", description = "Link deleted successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @ApiResponse(responseCode = "404", description = "Link not found")

    ResponseEntity<Void> deleteById(
            @Parameter(description = "Link ID", required = true)
            UUID id
    );

    @Operation(
            summary = "List links by user",
            description = "Returns all links associated with a specific user."
    )
    @ApiResponse(responseCode = "200", description = "Links retrieved successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @ApiResponse(responseCode = "404", description = "User not found")
    ResponseEntity<List<LinksResponseDTO>> findAllLinksByUser(
            @Parameter(description = "Username", required = true)
            String username
    );

    @Operation(
            summary = "Update link",
            description = "Updates a link by its ID. Accessible by the owner or administrators."
    )
    @ApiResponse(responseCode = "200", description = "Link updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request data")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @ApiResponse(responseCode = "404", description = "Link not found")
    ResponseEntity<LinksResponseDTO> update(
            @Parameter(description = "Link ID", required = true)
            UUID id,
            LinksUpdateDTO dto
    );
}
