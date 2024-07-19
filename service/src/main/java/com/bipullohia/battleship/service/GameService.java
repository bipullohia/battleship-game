package com.bipullohia.battleship.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.bipullohia.battleship.model.Constants;
import com.bipullohia.battleship.model.GameMove;
import com.bipullohia.battleship.model.GamePlay;
import com.bipullohia.battleship.model.GameStartResponse;
import com.bipullohia.battleship.model.GameStatus;
import com.bipullohia.battleship.model.ShipCollection;
import com.bipullohia.battleship.util.GameUtils;

@Service
public class GameService {
	
	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	
	public GameStartResponse startGameAgainstComputer(GamePlay newgame) {
		GameStartResponse gameResponse = new GameStartResponse();

		//generate a gameId and return to the client (the client will use that to start the gameplay)
		String newGameId = GameUtils.getNewGameId(); 
		newgame.setGameId(newGameId);
		
		//set game status as new (if it's vs computer) - otherwise wait for both players to setup the board
		newgame.setGameStatus(GameStatus.NEW);
		
		//validate the grid of the ship (player1) passed on by the client
		String playerGridValidity = GameUtils.validateGridSetup(newgame.getShipCollectionPlayer1());
		
		if(playerGridValidity.equals("true")) {
			//generate the grid from the computer's side
			ShipCollection newShipCollection = GameUtils.getNewPlacedShipCollection();
			if(newShipCollection != null) {
				newgame.setShipCollectionPlayer2(newShipCollection);
				
				//put both the grids in a temporary database and assign the key as the gameId
				//TODO - try catch block?
				redisTemplate.opsForValue().set(Constants.REDIS_GAMEINFO_PREFIX + newGameId, newgame);
		        redisTemplate.expire(Constants.REDIS_GAMEINFO_PREFIX + newGameId, 30, TimeUnit.MINUTES); //expiry of 30 minutes for every valid game
		        		        
		        //we only want to set these for complete successful game creation - otherwise we only send back status msg of error
				gameResponse.setGameId(newGameId);
		        gameResponse.setGameSetupStatus("success");
			
			}else {
				gameResponse.setGameSetupStatus("error: problem occurred while setting up the grid for computer!");
			}
						
		}else {
			//return an error saying the grid setup is incorrect - error handling
			gameResponse.setGameSetupStatus(playerGridValidity);
		}
		
		//return to the client - gameId (client uses this to communicate to BE for game moves via WS connection)
		System.out.println("New game started: " + newGameId);
		return gameResponse;
	}

	public GameMove processGameMove(GameMove move) {
		//process the gamemove done by the player
		
		//if the game is over - respond as such, otherwise computer plays it's turn
		GameMove newGameMove = new GameMove();
		newGameMove.setGameId(move.getGameId());
		newGameMove.setPlayer("computer");
		newGameMove.setCellId("GD");
		
		return newGameMove;
	}
	
	
	
	
}
