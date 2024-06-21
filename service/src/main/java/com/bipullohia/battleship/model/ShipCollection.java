package com.bipullohia.battleship.model;

import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ShipCollection {
	
	private ShipInfo carrier;
	private ShipInfo battleship;
	private ShipInfo destroyer;
	private ShipInfo submarine;
	private ShipInfo patrolboat;
	
	public ShipCollection() {
		carrier = new ShipInfo(ShipType.carrier);
		battleship = new ShipInfo(ShipType.battleship);
		destroyer = new ShipInfo(ShipType.destroyer);
		submarine = new ShipInfo(ShipType.submarine);
		patrolboat = new ShipInfo(ShipType.patrolboat);
	}
	
	public ShipInfo getCarrier() {
		return carrier;
	}
	public void setCarrier(ShipInfo carrier) {
		this.carrier = carrier;
	}
	public ShipInfo getBattleship() {
		return battleship;
	}
	public void setBattleship(ShipInfo battleship) {
		this.battleship = battleship;
	}
	public ShipInfo getDestroyer() {
		return destroyer;
	}
	public void setDestroyer(ShipInfo destroyer) {
		this.destroyer = destroyer;
	}
	public ShipInfo getSubmarine() {
		return submarine;
	}
	public void setSubmarine(ShipInfo submarine) {
		this.submarine = submarine;
	}
	public ShipInfo getPatrolboat() {
		return patrolboat;
	}
	public void setPatrolboat(ShipInfo patrolboat) {
		this.patrolboat = patrolboat;
	}
		
	@JsonIgnore
	public List<ShipInfo> getAllShips(){
		if(carrier.getShip()==null) carrier.setShip(ShipType.carrier);
		if(battleship.getShip()==null)battleship.setShip(ShipType.battleship);
		if(destroyer.getShip()==null)destroyer.setShip(ShipType.destroyer);
		if(submarine.getShip()==null)submarine.setShip(ShipType.submarine);
		if(patrolboat.getShip()==null)patrolboat.setShip(ShipType.patrolboat);
		return Arrays.asList(carrier, battleship, destroyer, submarine, patrolboat);
	}
	
	@Override
	public String toString() {
		return "ShipCollection [carrier=" + carrier + ", battleship=" + battleship + ", destroyer=" + destroyer
				+ ", submarine=" + submarine + ", patrolboat=" + patrolboat + "]";
	}
	
}


