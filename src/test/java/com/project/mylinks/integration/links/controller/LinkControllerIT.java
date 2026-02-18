package com.project.mylinks.integration.links.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.model.UserRole;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class LinkControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepositoryJpa userRepository;

    private UUID userId;

    @BeforeEach
    void setup() {

        userRepository.deleteAll();
        User user = new User();
        user.setEmail("user@email.com");
        user.setPassword("123456");
        user.setRole(UserRole.USER);
        userRepository.save(user);

        userId = user.getId();
    }

    @Test
    void shouldCreateLink() throws Exception {
        CreateLinksDTO dto = new CreateLinksDTO(
                "google",
                "https://google.com",
                userId
        );

        mockMvc.perform(post("/links")
                        .with(jwt().authorities(() -> "ROLE_USER")
                                .jwt(jwt -> jwt.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nameUrl").value("google"))
                .andExpect(jsonPath("$.url").value("https://google.com"));
    }

    @Test
    void shouldFindById() throws Exception {
        CreateLinksDTO dto = new CreateLinksDTO(
                "github",
                "https://github.com",
                userId
        );

        MvcResult result = mockMvc.perform(post("/links")
                        .with(jwt().authorities(() -> "ROLE_USER")
                                .jwt(jwt -> jwt.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn();

        LinksResponseDTO response =
                objectMapper.readValue(result.getResponse().getContentAsString(),
                        LinksResponseDTO.class);

        mockMvc.perform(get("/links/{id}", response.id())
                        .with(jwt().authorities(() -> "ROLE_USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(response.id().toString()));
    }

    @Test
    void shouldUpdateLink() throws Exception {
        CreateLinksDTO dto = new CreateLinksDTO(
                "youtube",
                "https://youtube.com",
                userId
        );

        MvcResult result = mockMvc.perform(post("/links")
                        .with(jwt().authorities(() -> "ROLE_USER")
                                .jwt(jwt -> jwt.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn();

        LinksResponseDTO response =
                objectMapper.readValue(result.getResponse().getContentAsString(),
                        LinksResponseDTO.class);

        LinksUpdateDTO update = new LinksUpdateDTO("ytd", null);

        mockMvc.perform(patch("/links/{id}", response.id())
                        .with(jwt().authorities(() -> "ROLE_USER")
                                .jwt(jwt -> jwt.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nameUrl").value("ytd"));
    }

    @Test
    void shouldDeleteLink() throws Exception {
        CreateLinksDTO dto = new CreateLinksDTO(
                "x",
                "https://x.com",
                userId
        );

        MvcResult result = mockMvc.perform(post("/links")
                        .with(jwt().authorities(() -> "ROLE_USER")
                                .jwt(jwt -> jwt.subject(userId.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn();

        LinksResponseDTO response =
                objectMapper.readValue(result.getResponse().getContentAsString(),
                        LinksResponseDTO.class);

        mockMvc.perform(delete("/links/{id}", response.id())
                        .with(jwt().authorities(() -> "ROLE_USER")
                                .jwt(jwt -> jwt.subject(userId.toString()))))
                .andExpect(status().isNoContent());
    }
}
