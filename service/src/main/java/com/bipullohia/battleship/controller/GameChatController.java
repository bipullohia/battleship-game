package com.bipullohia.battleship.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.bipullohia.battleship.model.ChatMessage;

@Controller
public class GameChatController {

    @MessageMapping("/game/battleship/chat") //handles messages sent by users
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage message){
        System.out.println(message);
        return message;
    }
}
