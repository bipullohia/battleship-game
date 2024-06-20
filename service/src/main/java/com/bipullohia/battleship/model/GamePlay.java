package com.bipullohia.battleship.model;

public class GamePlay {

	private String gameId; //unique game sessionId/ game identifier
	private String gameType; //player or computer
	private ShipCollection shipCollectionPlayer1; //shipCollection of Player 1
	private ShipCollection shipCollectionPlayer2; //shipCollection of Player 2  
	private String gameStatus; //to have the current status of the game - new, proc, done
	private String winner;
	
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public String getGameType() {
		return gameType;
	}
	public void setGameType(String gameType) {
		this.gameType = gameType;
	}
	public ShipCollection getShipCollectionPlayer1() {
		return shipCollectionPlayer1;
	}
	public void setShipCollectionPlayer1(ShipCollection shipCollectionPlayer1) {
		this.shipCollectionPlayer1 = shipCollectionPlayer1;
	}
	public ShipCollection getShipCollectionPlayer2() {
		return shipCollectionPlayer2;
	}
	public void setShipCollectionPlayer2(ShipCollection shipCollectionPlayer2) {
		this.shipCollectionPlayer2 = shipCollectionPlayer2;
	}
	public String getGameStatus() {
		return gameStatus;
	}
	public void setGameStatus(String gameStatus) {
		this.gameStatus = gameStatus;
	}
	public String getWinner() {
		return winner;
	}
	public void setWinner(String winner) {
		this.winner = winner;
	}
	
	@Override
	public String toString() {
		return "GamePlay [gameId=" + gameId + ", gameType=" + gameType + ", shipCollectionPlayer1="
				+ shipCollectionPlayer1 + ", shipCollectionPlayer2=" + shipCollectionPlayer2 + ", gameStatus="
				+ gameStatus + ", winner=" + winner + "]";
	}
	
	
}
