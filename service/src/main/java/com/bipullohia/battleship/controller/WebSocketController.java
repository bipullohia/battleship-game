package com.bipullohia.battleship.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.bipullohia.battleship.model.ChatMessage;
import com.bipullohia.battleship.model.GameMove;
import com.bipullohia.battleship.service.GameService;

@Controller
public class WebSocketController {
	
	@Autowired
	private GameService gameService;

    @MessageMapping("/msg") //handles the chat messages sent by the players
    @SendTo("/chat/public")
    public ChatMessage sendMessage(ChatMessage message){
        System.out.println("Chat message: " + message);
        return message;
    }
    
    @MessageMapping("/move") //handles the moves sent by the players
    @SendTo("/play/public")
    public GameMove makeMove(GameMove move){
        System.out.println("Game move: " + move);
        return gameService.processGameMove(move);
    }
}
