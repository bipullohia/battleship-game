package com.bipullohia.battleship.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bipullohia.battleship.model.GamePlay;
import com.bipullohia.battleship.model.GameStartResponse;
import com.bipullohia.battleship.service.GameService;

@RestController
@RequestMapping("/game/battleship/http/")
public class GamePlayController {
	
	@Autowired
	private GameService gameService;
	
	
	@PostMapping("/startgame")
	public GameStartResponse startGame(@RequestBody GamePlay newgame) {	
		return gameService.startGameAgainstComputer(newgame);
	}
	

}
