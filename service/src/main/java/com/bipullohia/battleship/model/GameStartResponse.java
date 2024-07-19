package com.bipullohia.battleship.model;

public class GameStartResponse {

	public GameStartResponse() {
	}
	
	private String gameId;
	private String gameSetupStatus;

	public String getGameSetupStatus() {
		return gameSetupStatus;
	}

	public void setGameSetupStatus(String gameSetupStatus) {
		this.gameSetupStatus = gameSetupStatus;
	}

	public String getGameId() {
		return gameId;
	}

	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	
}
