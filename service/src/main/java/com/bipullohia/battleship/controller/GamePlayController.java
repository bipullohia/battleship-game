package com.bipullohia.battleship.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bipullohia.battleship.model.GamePlay;
import com.bipullohia.battleship.service.GameService;

@RestController
@RequestMapping("/game/battleship/play")
public class GamePlayController {
	
	@Autowired
	GameService gameService;
	
	@PostMapping("/startgame") //with computer (can be judged using the object?)
	public GamePlay startGame(@RequestBody GamePlay newgame) {
		System.out.println("Game: " + newgame);
				
		//generate a gameId and return to the client (the client will use that to start the gameplay)
		newgame.setGameId("abr-ahs-cut"); //TODO: figure out a way to generate this
		
		//validate the grid of the ship (player1) passed on by the client
		boolean validPlayer1 = gameService.validateGridSetup(newgame.getShipCollectionPlayer1());
		
		if(validPlayer1) {
			//generate the grid from the computer's side
			newgame.setShipCollectionPlayer2(gameService.getNewPlacedShipCollection());
			
			//put both the grids in a temporary database and assign the key as the gameId
			
			
		}else {
			//return an error saying the grid setup is incorrect
			System.out.println("Ship collection grid incorrect for player 1");
		}
		
		//set game status as new (if it's vs computer) - otherwise wait for both players to setup the board
		newgame.setGameStatus("NEW");
		
		//return to the client - gameId (we will not pass the mapping of the computer's side of the grid - that will remain with the BE)
		return newgame;
	}
	

}
