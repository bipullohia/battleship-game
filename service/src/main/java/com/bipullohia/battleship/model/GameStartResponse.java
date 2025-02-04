package com.bipullohia.battleship.model;

public class GameStartResponse {

	public GameStartResponse() {
	}
	
	private String gameId;
	private String gameSetupStatus;
	private ShipCollection shipCollectionPlayer1;

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

	public ShipCollection getShipCollectionPlayer1() {
		return shipCollectionPlayer1;
	}

	public void setShipCollectionPlayer1(ShipCollection shipCollectionPlayer1) {
		this.shipCollectionPlayer1 = shipCollectionPlayer1;
	}
	
}
