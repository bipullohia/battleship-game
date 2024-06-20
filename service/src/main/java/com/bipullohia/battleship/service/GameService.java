package com.bipullohia.battleship.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.bipullohia.battleship.model.Constants;
import com.bipullohia.battleship.model.ShipCollection;
import com.bipullohia.battleship.model.ShipInfo;
import com.bipullohia.battleship.model.ShipType;

@Service
public class GameService {
	
	public boolean validateGridSetup(ShipCollection shipCollection) {
		Set<String> cellSet = new HashSet<>(); //to ensure unique placement of each cell
		System.out.println("Collection: " + shipCollection);
		
		for(ShipInfo shipInfo: shipCollection.getAllShips()) {
			
			System.out.println("Checking for: " + shipInfo.getShip().getShipName());
			ShipType ship = shipInfo.getShip();
			List<String> cells = shipInfo.getCells();
			
			//validate number of cells is valid for the ship
			if(ship.getCellCount() != cells.size()){
				System.out.println("Cell count is invalid for the ship: " + ship.getShipName()); //TODO: convert to LOGGER
				return false;
			}
			
			for(String cell: cells) {
				//check for cell overlap
				if(cellSet.contains(cell)) {
					System.out.println("Duplicate cell used for ship placement: " + cell);
					return false;
				}
				cellSet.add(cell);
				
				//check for boundary limitations
				if(!checkCellLimits(cell)) {
					System.out.println("Cell is outside the Battlefield: " + cell);
					return false;
				}
			}
			
			//check if the cells are in line
			if(!checkCellAlignment(cells, ship.getCellCount())) {
				System.out.println("Cells are not aligned properly for the ship: " + ship.getShipName());
				return false;
			}
		}
		//all good - validation passed!
		return true;
	}
	
	private boolean checkCellLimits(String cell) {
		//check for battlefield constraints
		char x = cell.charAt(0);
		char y = cell.charAt(1);
		
		if(x-65 > Constants.GRID_SIZE || y-65 > Constants.GRID_SIZE) {
			return false;
		}
		return true;
	}
	
	private boolean checkCellAlignment(List<String> cells, int cellCount) {
		boolean isHorizontal = false; //direction of ship placement
		
		//check for x or y direction (imagine cell 'AB' as xy)
		if(Math.abs(cells.get(0).charAt(0) - cells.get(1).charAt(0)) == 0) {
			isHorizontal = true; //no change in x coordinates -> horizontal placement
		}
		
		int horizontalDiff = 0;
		int verticalDiff = 0;
		
		for(int i=0; i<cellCount-1; i++) {
			horizontalDiff += cells.get(i).charAt(1) - cells.get(i+1).charAt(1); //check diff between y elements of the cells
			verticalDiff += cells.get(i).charAt(0) - cells.get(i+1).charAt(0); //check diff between x elements of the cells
		}
		
		System.out.println("Direction - is horizontal: " + isHorizontal + ", Hdiff: " + horizontalDiff + ", vDiff: " + verticalDiff);
		
		//the selected direction should have a difference of cellCount (and the other direction difference should be 0)
		if(isHorizontal) {
			if(Math.abs(horizontalDiff) == cellCount-1 && Math.abs(verticalDiff) == 0) return true;
			else return false;
		}else {
			if(Math.abs(verticalDiff) == cellCount-1 && Math.abs(horizontalDiff) == 0) return true;
			else return false;
		}
	}
	
	public ShipCollection getNewPlacedShipCollection() {
		return new ShipCollection();
	}
}
