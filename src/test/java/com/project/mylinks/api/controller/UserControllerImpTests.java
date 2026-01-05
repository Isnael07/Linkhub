package com.project.mylinks.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.api.dto.userDTO.UserResponseDTO;
import com.project.mylinks.application.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.*;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.http.MediaType;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserControllerImp.class)
@AutoConfigureMockMvc(addFilters = false)
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

    @Test
    void shouldDeleteUser() throws Exception{
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/user/{id}", id))
                .andExpect(status().isNoContent());

        verify(service, times(1)).delete(id);
    }

    @Test
    void shouldFindAllUser() throws Exception{
        UserResponseDTO dto = new UserResponseDTO(
                UUID.randomUUID(),
                "test",
                "test@gmail.com",
                List.of()
        );
        UserResponseDTO dto2 = new UserResponseDTO(
                UUID.randomUUID(),
                "test2",
                "test2@gmail.com",
                List.of()
        );

        List<UserResponseDTO> dtos = Arrays.asList(dto,dto2);

        Page<UserResponseDTO> page =
                new PageImpl<>(dtos, PageRequest.of(0,10),dtos.size());


        when(service.findAll(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/user")
                            .param("page", "0")
                            .param("size","10")
                            .accept(MediaType.APPLICATION_JSON))

                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].id").value(dto.id().toString()))
                .andExpect(jsonPath("$.content[0].username").value(dto.username()))
                .andExpect(jsonPath("$.content[0].email").value(dto.email()))
                .andExpect(jsonPath("$.content[0].links").isEmpty())

                .andExpect(jsonPath("$.content[1].id").value(dto2.id().toString()))
                .andExpect(jsonPath("$.content[1].username").value(dto2.username()))
                .andExpect(jsonPath("$.content[1].email").value(dto2.email()))
                .andExpect(jsonPath("$.content[1].links").isEmpty());



    }
}
