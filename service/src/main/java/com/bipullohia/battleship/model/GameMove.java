package com.bipullohia.battleship.model;

public class GameMove {

	private String gameId;
	private String player;
	private String cellId;
	
	public String getGameId() {
		return gameId;
	}
	public void setGameId(String gameId) {
		this.gameId = gameId;
	}
	public String getPlayer() {
		return player;
	}
	public void setPlayer(String player) {
		this.player = player;
	}
	public String getCellId() {
		return cellId;
	}
	public void setCellId(String cellId) {
		this.cellId = cellId;
	}
	
	@Override
	public String toString() {
		return "GameMove [gameId=" + gameId + ", player=" + player + ", cellId=" + cellId + "]";
	}
	
}
