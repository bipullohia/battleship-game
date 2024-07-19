package com.bipullohia.battleship.model;

public class GamePlay {

	private String gameId; //unique game sessionId/ game identifier
	private String opponentType; //player or computer
	private ShipCollection shipCollectionPlayer1; //shipCollection of Player 1
	private ShipCollection shipCollectionPlayer2; //shipCollection of Player 2 
	private GameStatus gameStatus; //to have the current status of the game
	private String winner;
	
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public String getOpponentType() {
		return opponentType;
	}
	public void setOpponentType(String opponentType) {
		this.opponentType = opponentType;
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
	public GameStatus getGameStatus() {
		return gameStatus;
	}
	public void setGameStatus(GameStatus gameStatus) {
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
		return "GamePlay [gameId=" + gameId + ", opponentType=" + opponentType + ", shipCollectionPlayer1="
				+ shipCollectionPlayer1 + ", shipCollectionPlayer2=" + shipCollectionPlayer2 + ", gameStatus="
				+ gameStatus + ", winner=" + winner + "]";
	}
	
	
}
