package com.bipullohia.battleship.model;

public enum ShipType {
	carrier("Carrier", 5), 
	battleship("Battleship", 4), 
	destroyer("Destroyer", 3), 
	submarine("Submarine", 3), 
	patrolboat("Patrol Boat", 2);
	
	private final int cellCount;
	private final String shipName;
	
	ShipType(String shipName, int cellCount) {
		this.shipName = shipName;
		this.cellCount = cellCount;
	}

	public int getCellCount() {
		return cellCount;
	}
	
	public String getShipName() {
		return shipName;
	}

}
