package com.project.mylinks.integration.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO;
import com.project.mylinks.api.dto.userDTO.CreateUserDTO;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.model.UserRole;
import com.project.mylinks.infrastructure.persistency.jpa.UserRepositoryJpa;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepositoryJpa repository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private String asJson(Object obj) throws Exception {
        return new ObjectMapper().writeValueAsString(obj);
    }

    @BeforeEach
    void setup() {
        repository.deleteAll();

        User user = new User();
        user.setUsername("test");
        user.setEmail("test@gmail.com");
        user.setPassword(passwordEncoder.encode("123456"));
        user.setRole(UserRole.USER);

        repository.save(user);
    }

    @Test
    void shouldLoginSuccessfully() throws Exception {
        LoginRequestDTO login = new LoginRequestDTO("test@gmail.com", "123456");

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.expiresIn").value(300));
    }

    @Test
    void shouldReturn401WithWrongPassword() throws Exception {
        LoginRequestDTO login = new LoginRequestDTO("test@gmail.com", "wrong");

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(login)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldSignupSuccessfully() throws Exception {
        CreateUserDTO dto = new CreateUserDTO("new", "new@gmail.com", "123");

        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(dto)))
                .andExpect(status().isOk());

        assertTrue(repository.findByEmail("new@gmail.com").isPresent());
    }

    @Test
    void shouldNotSignupWithDuplicateEmail() throws Exception {
        CreateUserDTO dto = new CreateUserDTO("test", "test@gmail.com", "123");

        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem")
                        .value("Email já em uso"));
    }


    @Test
    void shouldReturn400WhenEmailIsInvalid() throws Exception {
        LoginRequestDTO login = new LoginRequestDTO("email-invalido", "123");

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(login)))
                .andExpect(status().isBadRequest());
    }


}

