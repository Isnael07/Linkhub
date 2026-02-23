package com.project.mylinks.integration.auth.permission;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO;
import com.project.mylinks.api.dto.userDTO.UserUpdateDTO;
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
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
        properties = "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration"
)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserPermissionTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    UserRepositoryJpa userRepo;

    @Autowired
    BCryptPasswordEncoder encoder;

    UUID adminId;
    UUID userId;
    UUID otherUserId;

    @BeforeEach
    void setup() {
        userRepo.deleteAll();

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@mail.com");
        admin.setPassword(encoder.encode("123"));
        admin.setRole(UserRole.ADMIN);

        User user = new User();
        user.setUsername("user");
        user.setEmail("user@mail.com");
        user.setPassword(encoder.encode("123"));
        user.setRole(UserRole.USER);

        User otherUser = new User();
        otherUser.setUsername("otherUser");
        otherUser.setEmail("otherUser@mail.com");
        otherUser.setPassword(encoder.encode("123"));
        otherUser.setRole(UserRole.USER);


        adminId = userRepo.save(admin).getId();
        userId = userRepo.save(user).getId();
        otherUserId = userRepo.save(otherUser).getId();
    }

    private String asJson(Object obj) throws Exception {
        return new ObjectMapper().writeValueAsString(obj);
    }

    String login(String email) throws Exception {
        LoginRequestDTO dto = new LoginRequestDTO(email, "123");

        MvcResult res = mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(dto)))
                .andReturn();

        return JsonPath.read(res.getResponse().getContentAsString(), "$.accessToken");
    }


    @Test
    void adminCanListUsers() throws Exception {
        String token = login("admin@mail.com");

        mockMvc.perform(get("/user")
                        .header("Authorization","Bearer "+token))
                .andExpect(status().isOk());
    }

    @Test
    void adminCanDeleteAnyUser() throws Exception {
        String token = login("admin@mail.com");

        mockMvc.perform(delete("/user/{id}", userId)
                        .header("Authorization","Bearer "+token))
                .andExpect(status().isNoContent());
    }

    @Test
    void userCannotListUsers() throws Exception {
        String token = login("user@mail.com");

        mockMvc.perform(get("/user")
                        .header("Authorization","Bearer "+token))
                .andExpect(status().isForbidden());
    }

    @Test
    void userCanAccessOwnProfile() throws Exception {
        String token = login("user@mail.com");

        mockMvc.perform(get("/user/{id}", userId)
                        .header("Authorization","Bearer "+token))
                .andExpect(status().isOk());
    }

    @Test
    void userCannotDeleteOtherUser() throws Exception {
        String token = login("user@mail.com");

        mockMvc.perform(delete("/user/{id}", otherUserId)
                        .header("Authorization","Bearer "+token))
                .andExpect(status().isForbidden());
    }

    @Test
    void userCannotDeleteAdmin() throws Exception {
        String token = login("user@mail.com");

        mockMvc.perform(delete("/user/{id}", adminId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanUpdateAnyUser() throws Exception {
        String token = login("admin@mail.com");

        UserUpdateDTO dto = new UserUpdateDTO("newName", "new");

        mockMvc.perform(patch("/user/{id}", userId)
                        .header("Authorization","Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void userCannotUpdateOtherUser() throws Exception {
        String token = login("user@mail.com");

        UserUpdateDTO dto = new UserUpdateDTO("newName", "new");

        mockMvc.perform(patch("/user/{id}", otherUserId)
                        .header("Authorization","Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    void userCanUpdateOwnProfile() throws Exception {
        String token = login("user@mail.com");

        UserUpdateDTO dto = new UserUpdateDTO("newName", "new");

        mockMvc.perform(patch("/user/{id}", userId)
                        .header("Authorization","Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(dto)))
                .andExpect(status().isOk());
    }

}

