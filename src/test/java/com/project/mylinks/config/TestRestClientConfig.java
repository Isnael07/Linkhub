package com.project.mylinks.config;


import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestClient;

@TestConfiguration
public class TestRestClientConfig {
    @Bean
    RestClient restClient(){
        return RestClient.builder().build();
    }
}
