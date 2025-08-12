package com.fitness.gateway.user;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

//specialized web client for user service
@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    //validate and call the particular user
    @Bean
    public WebClient userServiceWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder
                .baseUrl("http://USER-SERVICE")
                .build();
    }
}
