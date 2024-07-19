package com.bipullohia.battleship.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import com.bipullohia.battleship.model.Constants;
import com.bipullohia.battleship.model.ShipCollection;
import com.bipullohia.battleship.model.ShipInfo;
import com.bipullohia.battleship.model.ShipType;

public class GameUtils {

	private static final String LETTERS = "abcdefghijklmnopqrstuvwxyz";
	private static final Random RANDOM = new Random(); 
	

	public static String getNewGameId() {
		StringBuilder sb = new StringBuilder();
		
		for(int i=0; i<6; i++) {
			sb.append(getRandomChar());
		}
		
		sb.insert(3, '-');
		return sb.toString();
	}
	
	public static String validateGridSetup(ShipCollection shipCollection) {
		Set<String> cellSet = new HashSet<>(); //to ensure unique placement of each cell
		
		for(ShipInfo shipInfo: shipCollection.getAllShips()) {
			ShipType ship = shipInfo.getShip();
			List<String> cells = shipInfo.getCells();
			Collections.sort(cells);
			
			//validate number of cells is valid for the ship
			if(ship.getCellCount() != cells.size()){
				return "error: cell count is invalid for the ship: " + ship.getShipName();
			}
			
			for(String cell: cells) {
				//check for cell overlap
				if(cellSet.contains(cell)) {
					return "error: duplicate cell used for ship placement: " + cell;
				}
				cellSet.add(cell);
				
				//check for boundary limitations
				if(!checkCellLimits(cell)) {
					return "error: cell is outside the Battlefield: " + cell;
				}
			}
			
			//check if the cells are in line
			if(!checkCellAlignment(cells, ship.getCellCount())) {
				return "error: cells are not aligned properly for the ship: " + ship.getShipName();
			}
		}
		
		//all good - validation passed!
		return "true";
	}
	
	//to create a new grid for player2 as computer
	public static ShipCollection getNewPlacedShipCollection() {
		ShipCollection newShipCollection = new ShipCollection();
		Set<String> cellSet = new HashSet<>();
		Random random = new Random();
		
		for(ShipInfo shipInfo: newShipCollection.getAllShips()) {
			int cellCount = shipInfo.getShip().getCellCount();
			while(shipInfo.getCells().size() < cellCount) {
				//we need to retry until we get a proper ship placement on the grid
				placeShipOnTheGrid(shipInfo, cellSet, random);
			}
			//ship is placed - add the cells to the cellSet for the next ship's placement check
			cellSet.addAll(shipInfo.getCells());
		}
		
		String playerGridValidity = validateGridSetup(newShipCollection);
		if(playerGridValidity.equals("true")) {
			return newShipCollection;
		}
		
		return null;
	}
	
	
	
	
	/*  ALL THE PRIVATE METHODS TO BE USED BY EXPOSED FUNCTIONS ABOVE  */
	
	private static char getRandomChar() {
		return LETTERS.charAt(RANDOM.nextInt(LETTERS.length()));
	} 
	
	//to make sure cells doesn't go out of the grid itself
	private static boolean checkCellLimits(String cell) {
		char x = cell.charAt(0);
		char y = cell.charAt(1);
		
		if(x-65 > Constants.GRID_SIZE || y-65 > Constants.GRID_SIZE) {
			return false;
		}
		return true;
	}
	
	//to check if the ship is placed properly (horizontal or vertical) - all the cells must align in a single direction without gaps
	private static boolean checkCellAlignment(List<String> cells, int cellCount) {
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
						
		//the selected direction should have a difference of cellCount-1 (and the other direction difference should be 0)
		if(isHorizontal) {
			if(Math.abs(horizontalDiff) == cellCount-1 && Math.abs(verticalDiff) == 0) return true;
			else return false;
		}else {
			if(Math.abs(verticalDiff) == cellCount-1 && Math.abs(horizontalDiff) == 0) return true;
			else return false;
		}
	}
	
		
	private static void placeShipOnTheGrid(ShipInfo shipInfo, Set<String> cellSet, Random random) {
		int cellCount = shipInfo.getShip().getCellCount();
		List<String> directions = new ArrayList<>(Arrays.asList("left", "right", "up", "down"));
		List<String> cells = new ArrayList<>();
		String cell = getRandomUnusedCell(cellSet, random);
		
		//get cell placement based on a random direction
		while(!directions.isEmpty()) {
			int i = random.nextInt(directions.size()); //getting a random direction index out of the remaining ones
			String direction = directions.get(i);
			directions.remove(i); //this is so that the same direction is not repeated
			
			cells = getCellsForShip(cell, cellCount, cellSet, direction);
			if(cells.size() > 0) break; //we got a proper alignment - no more direction needed!
		}
		//there is a chance that we didn't get a proper cell combination in any of the 4 directions - that is handled in the parent class
		shipInfo.setCells(cells);
	}
	
	private static String getRandomUnusedCell(Set<String> cellSet, Random random) {
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
		return cell;
	}
	
	private static List<String> getCellsForShip(String cell, int cellCount, Set<String> cellSet, String direction){
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
