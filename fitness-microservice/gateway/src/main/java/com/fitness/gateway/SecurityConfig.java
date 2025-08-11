package com.fitness.gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

// security configuration of API Gateway
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    // Filter chain - security rules of http requests
    // security configuration of oauth2 authentication
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(csrf -> csrf.disable())
                    .authorizeExchange(exchange -> exchange
                            //.pathMatchers("/actuator/*").permitAll()
                            .anyExchange().authenticated()
                    )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
                .build();
    }
}
