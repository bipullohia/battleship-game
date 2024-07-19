package com.bipullohia.battleship.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker //enables WebSocket message handling, backed by a message broker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{

    /* configures a simple message broker for message handling
    	1. enables a broker to send messages to clients/browsers via /chat prefix 
    	2. sets the application destination prefix to /action
    */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry){ 
        registry.enableSimpleBroker("/chat", "/play");
        registry.setApplicationDestinationPrefixes("/action");
    }
    
    /* configures WebSocket endpoint, /game/battleship in this case, 
    	and enables SockJS fallback options
    */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        registry
        .addEndpoint("/game/battleship/ws")
        .setAllowedOrigins("http://localhost:3000") //for removing the CORS error
        .withSockJS();
    }
}
