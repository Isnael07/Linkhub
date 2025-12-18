package com.project.mylinks.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.application.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserControllerImp.class)
class UserControllerImpTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService service;

    @Test
    void shouldCreateUser() throws Exception {
        CreateUserDTO create = new CreateUserDTO(
                "userTest",
                "userteste@gmail.com",
                "teste123"
        );

        UserResponseDTO response = new UserResponseDTO(
                UUID.randomUUID(),
                create.username(),
                create.email(),
                List.of()
        );

        Mockito.when(service.create(Mockito.any(CreateUserDTO.class)))
                .thenReturn(response);

        mockMvc.perform(post("/user")
                        .with(jwt().authorities())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(create)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("userTest"))
                .andExpect(jsonPath("$.email").value("userteste@gmail.com"))
                .andExpect(jsonPath("$.links").isArray());
    }

    @Test
    void shouldFindUserById() throws Exception {
        UserResponseDTO response = new UserResponseDTO(
                UUID.randomUUID(),
                "userTest",
                "userteste@gmail.com",
                List.of()

        );

        Mockito.when(service.findById(response.id())).thenReturn(response);

        mockMvc.perform(get("/user/{id}", response.id())
                        .with(jwt().authorities()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(response.id().toString()))
                .andExpect(jsonPath("$.username").value("userTest"));
    }
}
