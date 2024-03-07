package com.bipullohia.battleship.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker //enables WebSocket message handling, backed by a message broker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
    
    // configures WebSocket endpoints, /chat in this case, and enables SockJS fallback options
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        registry
        .addEndpoint("/chat")
        .setAllowedOrigins("http://localhost:3000") //for removing the CORS error
        .withSockJS();
    }

    //configures a simple message broker for message handling. It enables a broker to send messages to clients via /topic prefix and sets the application destination prefix to /app.
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry){ 
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
