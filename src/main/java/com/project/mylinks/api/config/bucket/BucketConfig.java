package com.project.mylinks.api.config.bucket;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class BucketConfig {

    @Bean
    RestClient bucketRestClient(@Value("${bucket.url}") String bucketUrl,
                                @Value("${bucket.service-role-key}") String serviceRoleKey){

        return RestClient.builder()
                .baseUrl(bucketUrl)
                .defaultHeader("apikey", serviceRoleKey)
                .defaultHeader("Authorization", "Bear " + serviceRoleKey)
                .build();

    }
}
