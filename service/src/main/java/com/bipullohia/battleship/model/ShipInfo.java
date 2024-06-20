package com.bipullohia.battleship.model;

import java.util.ArrayList;
import java.util.List;

public class ShipInfo {

	private ShipType ship;
	private List<String> cells;
	
	public ShipInfo() {
	}
	
	public ShipInfo(ShipType ship) {
		this.ship = ship;
		cells = new ArrayList<>();
	}
	
	public ShipType getShip() {
		return ship;
	}

	public void setShip(ShipType ship) {
		this.ship = ship;
	}

	public List<String> getCells() {
		return cells;
	}

	public void setCells(List<String> cells) {
		this.cells = cells;
	}

	@Override
	public String toString() {
		return "ShipInfo [ship=" + ship + ", cells=" + cells + "]";
	}

}