package com.project.mylinks.integration.links.permission;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import com.project.mylinks.domain.model.Links;
import com.project.mylinks.domain.model.User;
import com.project.mylinks.domain.model.UserRole;
import com.project.mylinks.infrastructure.persistency.jpa.LinksRepositoryJpa;
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

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LinkPermissionTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    UserRepositoryJpa userRepo;

    @Autowired
    LinksRepositoryJpa linkRepo;

    @Autowired
    BCryptPasswordEncoder encoder;

    UUID adminId;
    UUID userId;
    UUID otherUserId;

    UUID userLinkId;
    UUID otherUserLinkId;

    @BeforeEach
    void setup() {
        linkRepo.deleteAll();
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
        otherUser.setEmail("other@mail.com");
        otherUser.setPassword(encoder.encode("123"));
        otherUser.setRole(UserRole.USER);

        adminId = userRepo.save(admin).getId();
        userId = userRepo.save(user).getId();
        otherUserId = userRepo.save(otherUser).getId();

        Links userLink = new Links();
        userLink.setNameUrl("User Link");
        userLink.setUrl("https://user.com");
        userLink.setUser(user);

        Links otherLink = new Links();
        otherLink.setNameUrl("Other Link");
        otherLink.setUrl("https://other.com");
        otherLink.setUser(otherUser);

        userLinkId = linkRepo.save(userLink).getId();
        otherUserLinkId = linkRepo.save(otherLink).getId();
    }

    private String asJson(Object obj) throws Exception {
        return new ObjectMapper().writeValueAsString(obj);
    }

    String login(String email) throws Exception {
        var dto = new com.project.mylinks.api.dto.loginDTOs.LoginRequestDTO(email, "123");

        MvcResult res = mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(dto)))
                .andReturn();

        return JsonPath.read(res.getResponse().getContentAsString(), "$.accessToken");
    }

    @Test
    void adminCanListAllLinks() throws Exception {
        String token = login("admin@mail.com");

        mockMvc.perform(get("/links")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void userCannotListAllLinks() throws Exception {
        String token = login("user@mail.com");

        mockMvc.perform(get("/links")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void userCanDeleteOwnLink() throws Exception {
        String token = login("user@mail.com");

        mockMvc.perform(delete("/links/{id}", userLinkId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    @Test
    void userCannotDeleteOtherLink() throws Exception {
        String token = login("user@mail.com");

        mockMvc.perform(delete("/links/{id}", otherUserLinkId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanDeleteAnyLink() throws Exception {
        String token = login("admin@mail.com");

        mockMvc.perform(delete("/links/{id}", otherUserLinkId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    @Test
    void userCanUpdateOwnLink() throws Exception {
        String token = login("user@mail.com");

        var dto = new com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO("New", "https://new.com");

        mockMvc.perform(patch("/links/{id}", userLinkId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void userCannotUpdateOtherLink() throws Exception {
        String token = login("user@mail.com");

        var dto = new com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO("New", "https://new.com");

        mockMvc.perform(patch("/links/{id}", otherUserLinkId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJson(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    void userCanListOwnLinks() throws Exception {
        String token = login("user@mail.com");

        mockMvc.perform(get("/links/users/{id}/links", userId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void userCannotListOtherUserLinks() throws Exception {
        String token = login("user@mail.com");

        mockMvc.perform(get("/links/users/{id}/links", otherUserId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
