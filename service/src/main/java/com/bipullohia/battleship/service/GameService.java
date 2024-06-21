package com.bipullohia.battleship.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
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
		
		for(ShipInfo shipInfo: shipCollection.getAllShips()) {
			System.out.println("Checking for ship: " + shipInfo.getShip().getShipName());
			ShipType ship = shipInfo.getShip();
			List<String> cells = shipInfo.getCells();
			Collections.sort(cells); //
			
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
		System.out.println("Grid Validation successful!");
		return true;
	}
	
	//to make sure cells doesn't go out of the grid itself
	private boolean checkCellLimits(String cell) {
		char x = cell.charAt(0);
		char y = cell.charAt(1);
		
		if(x-65 > Constants.GRID_SIZE || y-65 > Constants.GRID_SIZE) {
			return false;
		}
		return true;
	}
	
	//to check if the ship is placed properly (horizontal or vertical) - all the cells must align in a single direction without gaps
	private boolean checkCellAlignment(List<String> cells, int cellCount) {
		boolean isHorizontal = false; //direction of ship placement
		int horizontalDiff = 0;
		int verticalDiff = 0;
		
		//check for x or y direction (imagine cell 'AB' as xy)
		if(Math.abs(cells.get(0).charAt(0) - cells.get(1).charAt(0)) == 0) {
			isHorizontal = true; //no change in x coordinates -> horizontal placement
		}
		
		//calculating the horizontal and vertical differences
		for(int i=0; i<cellCount-1; i++) {
			horizontalDiff += cells.get(i).charAt(1) - cells.get(i+1).charAt(1); //check diff between y elements of the cells
			verticalDiff += cells.get(i).charAt(0) - cells.get(i+1).charAt(0); //check diff between x elements of the cells
		}
		
		System.out.println("cellcount: " + cellCount + ", isHorizonta: " + isHorizontal + ", horizonDiff: " + horizontalDiff + ", vetDiff: " + verticalDiff);
				
		//the selected direction should have a difference of cellCount-1 (and the other direction difference should be 0)
		if(isHorizontal) {
			if(Math.abs(horizontalDiff) == cellCount-1 && Math.abs(verticalDiff) == 0) return true;
			else return false;
		}else {
			if(Math.abs(verticalDiff) == cellCount-1 && Math.abs(horizontalDiff) == 0) return true;
			else return false;
		}
	}
	
	//to create a new grid for player2 as computer
	public ShipCollection getNewPlacedShipCollection() {
		ShipCollection newShipCollection = new ShipCollection();
		Set<String> cellSet = new HashSet<>();
		Random random = new Random();
		
		for(ShipInfo shipInfo: newShipCollection.getAllShips()) {
			int cellCount = shipInfo.getShip().getCellCount();
			while(shipInfo.getCells().size() < cellCount) {
				//we need to retry until we get a proper ship placement on the grid
				System.out.println("Ship placement starts...");
				placeShipOnTheGrid(shipInfo, cellSet, random);
			}
			//ship is placed - add the cells to the cellSet for the next ship's placement check
			cellSet.addAll(shipInfo.getCells());
		}
		
		if(!validateGridSetup(newShipCollection)) {
			//TODO: Throw an error and error out the process
			System.out.println("New Player's Grid setup is invalid!");
		}
		
		return newShipCollection;
	}
	
	private void placeShipOnTheGrid(ShipInfo shipInfo, Set<String> cellSet, Random random) {
		int cellCount = shipInfo.getShip().getCellCount();
		List<String> directions = new ArrayList<>(Arrays.asList("left", "right", "up", "down"));
		List<String> cells = new ArrayList<>();
		String cell = getRandomUnusedCell(cellSet, random);
		
		//get cell placement based on a random direction
		while(!directions.isEmpty()) {
			int i = random.nextInt(directions.size()); //getting a random direction index out of the remaining ones
			String direction = directions.get(i);
			System.out.println("Direction: " + direction);
			directions.remove(i); //this is so that the same direction is not repeated
			System.out.println("Trying to place a ship at: " + direction);
			
			cells = getCellsForShip(cell, cellCount, cellSet, direction);
			if(cells.size() > 0) break; //we got a proper alignment - no more direction needed!
		}
		//there is a chance that we didn't get a proper cell combination in any of the 4 directions - that is handled in the parent class
		shipInfo.setCells(cells);
	}
	
	private String getRandomUnusedCell(Set<String> cellSet, Random random) {
		String cell = "";
		
		while(cell.isBlank()) {
			char x = (char) (65+random.nextInt(Constants.GRID_SIZE));
			char y = (char) (65+random.nextInt(Constants.GRID_SIZE));
			String tempCell = String.valueOf(x) + String.valueOf(y);
			//continue only if this cell is not already used for another ship
			if(!cellSet.contains(tempCell)) {
				cell = tempCell;
			}
		}
		System.out.println("Fetched random unused cell: " + cell);
		return cell;
	}
	
	private List<String> getCellsForShip(String cell, int cellCount, Set<String> cellSet, String direction){
		List<String> cells = new ArrayList<>();
		
		//check all the cells are in the range of the grid - depending on the direction
		//we want to make sure (cellCount-1) cells can be placed in that direction. -1 because we have the base cell already
		int x = cell.charAt(0) - 65;
		int y = cell.charAt(1) - 65;
		
		if(direction.equals("left")) {
			if(y - (cellCount-1) >= 0) {
				for(int i=0; i<cellCount; i++) {
					cells.add(String.valueOf((char)(x+65))+String.valueOf((char)(y-i+65)));
				}
			}
		}else if(direction.equals("right")) {
			if(y + (cellCount-1) < Constants.GRID_SIZE) {
				for(int i=0; i<cellCount; i++) {
					cells.add(String.valueOf((char)(x+65))+String.valueOf((char)(y+i+65)));
				}
			}
		}else if(direction.equals("up")) {
			if(x - (cellCount-1) >= 0) {
				for(int i=0; i<cellCount; i++) {
					cells.add(String.valueOf((char)(x-i+65))+String.valueOf((char)(y+65)));
				}
			}
		}else {
			//down
			if(x + (cellCount-1) < Constants.GRID_SIZE) {
				for(int i=0; i<cellCount; i++) {
					cells.add(String.valueOf((char)(x+i+65))+String.valueOf((char)(y+65)));
				}
			}
		}
		
		//check if they are unused
		for(String c: cells) {
			if(cellSet.contains(c)) return new ArrayList<>(); //returning an empty list since the entire cells list is invalid
		}
		
		return cells;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
