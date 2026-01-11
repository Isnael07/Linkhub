package com.project.mylinks.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mylinks.api.dto.linksDTO.CreateLinksDTO;
import com.project.mylinks.api.dto.linksDTO.LinksResponseDTO;
import com.project.mylinks.api.dto.linksDTO.LinksUpdateDTO;
import com.project.mylinks.application.service.LinksService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(LinkControllerImp.class)
@AutoConfigureMockMvc(addFilters = false)
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
class LinksControllerImpTests {

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LinksService service;

    @Autowired
    private MockMvc mockMvc;


    @Test
    void shouldCreateLinks() throws Exception {
        CreateLinksDTO payload = new CreateLinksDTO(
                "testUrl",
                "https://teste.com",
                UUID.randomUUID()
        );

        LinksResponseDTO response = new LinksResponseDTO(
                UUID.randomUUID(),
                payload.nameUrl(),
                payload.url()
        );

        when(service.create(payload)).thenReturn(response);

        mockMvc.perform(post("/links")
                .content(objectMapper.writeValueAsString(payload))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))


                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(response.id().toString()))
                .andExpect(jsonPath("$.nameUrl").value(response.nameUrl()))
                .andExpect(jsonPath("$.url").value(response.url()));
    }
    @Test
    void shouldFindByIdLinks() throws Exception{
        LinksResponseDTO response = new LinksResponseDTO(
                UUID.randomUUID(),
                "testUrl",
                "https://teste.com"
        );

        when(service.findById(response.id())).thenReturn(response);

        mockMvc.perform(get("/links/{id}", response.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(response.id().toString()))
                .andExpect(jsonPath("$.nameUrl").value(response.nameUrl()))
                .andExpect(jsonPath("$.url").value(response.url()));
    }

    @Test
    void shouldFindAllLinks() throws Exception {
        LinksResponseDTO link1 = new LinksResponseDTO(
                UUID.randomUUID(),
                "testUrl1",
                "https://test1.com"
        );
        LinksResponseDTO link2 = new LinksResponseDTO(
                UUID.randomUUID(),
                "testUrl2",
                "https://test2.com"
        );

        List<LinksResponseDTO> response = Arrays.asList(link1,link2);

        Page<LinksResponseDTO> page =
                new PageImpl<>(response, PageRequest.of(0,10),response.size());

        when(service.findAll(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/links")
                    .param("page", "10")
                    .param("size","10")
                    .accept(MediaType.APPLICATION_JSON))

                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(response.size()))

                .andExpect(jsonPath("$.content[0].id").value(link1.id().toString()))
                .andExpect(jsonPath("$.content[0].nameUrl").value(link1.nameUrl()))
                .andExpect(jsonPath("$.content[0].url").value(link1.url()))

                .andExpect(jsonPath("$.content[1].id").value(link2.id().toString()))
                .andExpect(jsonPath("$.content[1].nameUrl").value(link2.nameUrl()))
                .andExpect(jsonPath("$.content[1].url").value(link2.url()));
    }

    @Test
    void shouldDeleteLinks() throws Exception{
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/links/{id}", id))
                .andExpect(status().isNoContent());

        verify(service, times(1)).delete(id);
    }

   @Test
   void shouldUpdateLinks() throws Exception {
        UUID id = UUID.randomUUID();

       LinksUpdateDTO update = new LinksUpdateDTO(
               "upNome",
               "https://uptest.com"
       );

        LinksResponseDTO response = new LinksResponseDTO(
                id,
                update.nameUrl(),
                update.url()
        );

       when(service.update(id, update)).thenReturn(response);

       mockMvc.perform(patch("/links/{id}", id)
                   .contentType(MediaType.APPLICATION_JSON)
                   .content(objectMapper.writeValueAsString(update)))

               .andExpect(status().isOk())
               .andExpect(jsonPath("$.id").value(response.id().toString()))
               .andExpect(jsonPath("$.nameUrl").value(response.nameUrl()))
               .andExpect(jsonPath("$.url").value(response.url()));
   }

   @Test
    void shouldFindAllLinksByUser() throws Exception {
        UUID userId =  UUID.randomUUID();


       LinksResponseDTO link1 = new LinksResponseDTO(
               UUID.randomUUID(),
               "Google",
               "https://google.com"
       );

       LinksResponseDTO link2 = new LinksResponseDTO(
               UUID.randomUUID(),
               "GitHub",
               "https://github.com"
       );

       List<LinksResponseDTO> response = List.of(link1, link2);

       when(service.findAllLinksByUserId(userId)).thenReturn(response);

       mockMvc.perform(get("/links/users/{id}/links", userId)
                       .contentType(MediaType.APPLICATION_JSON))

               .andExpect(status().isOk())
               .andExpect(jsonPath("$.length()").value(response.size()))
               .andExpect(jsonPath("$[0].id").value(link1.id().toString()))
               .andExpect(jsonPath("$[0].nameUrl").value(link1.nameUrl()))
               .andExpect(jsonPath("$[0].url").value(link1.url()))
               .andExpect(jsonPath("$[1].id").value(link2.id().toString()))
               .andExpect(jsonPath("$[1].nameUrl").value(link2.nameUrl()))
               .andExpect(jsonPath("$[1].url").value(link2.url()));
   }
}
