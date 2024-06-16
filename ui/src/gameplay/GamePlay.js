import { useState } from "react"
import { DefaultMessages as Msg } from "../constants";
import { Props as Values } from "../constants"
import './GamePlay.css'

function GamePlay() {

    const [gridSetupMode, setGridSetupMode] = useState(true);
    const [placedShipCount, setPlacedShipCount] = useState('0');
    const [shipDirection, setShipDirection] = useState('Horizontal'); //default direction
    const [selectedShip, setSelectedShip] = useState('');
    const [selectedCells, setSelectedCells] = useState([]);
    const [placedCells, setPlacedCells] = useState([]);

    //ship placements on the grid
    const [shipInfo, setShipInfo] = useState({
        carrier: {
            shipName: "Carrier",
            bgcolor: 'cell-bg-placedposition-carrier',
            shipPlaced: false,
            cellCount: 5,
            cells: [],
        },
        battleship: {
            shipName: "BattleShip",
            bgcolor: 'cell-bg-placedposition-battleship',
            shipPlaced: false,
            cellCount: 4,
            cells: []
        },
        destroyer: {
            shipName: "Destroyer",
            bgcolor: 'cell-bg-placedposition-destroyer',
            shipPlaced: false,
            cellCount: 3,
            cells: []
        },
        submarine: {
            shipName: "Submarine",
            bgcolor: 'cell-bg-placedposition-submarine',
            shipPlaced: false,
            cellCount: 3,
            cells: []
        },
        patrolboat: {
            shipName: "Patrol Boat",
            bgcolor: 'cell-bg-placedposition-patrolboat',
            shipPlaced: false,
            cellCount: 2,
            cells: []
        },
    });

    const gameRules = () => {
        return (
            <div className="mx-auto  ms-5">
                <h6 className="mt-5 fw-bold">Game Rules...</h6>
                <ol className="text-start">
                    <li>We are playing a classic game of 'BattleShip'</li>
                    <li>Setup your Grid/Battlefield by placing all the warships in the ocean</li>
                    <li>Try to place it in such a way that it is harder for your opponent to guess it</li>
                    <li>To place a ship, select a ship and then select a valid cell on the grid</li>
                    <li>You can select the ship orientation using the radio buttons Horizontal/Vertical</li>
                    <li>In the meantime, your opponent will also be setting up their own grid</li>
                    <li>Once the game starts, the first to sink all the ships of the opponent wins!</li>
                </ol>

                {/* <div className="mt-5">
                    <h5>Ignore these...</h5>
                    <p>Ship direction: {shipDirection}</p>
                    <p>Selected Ship: {selectedShip}</p>
                    <p>{selectedCells}</p>
                    <p>{placedCells}</p>
                </div> */}
            </div>
        )
    }

    const cellMouseEnterAction = (cellId) => {
        const validCellIds = [];

        //a ship has to be selected for the hover position to be displayed
        if (selectedShip) {
            const x = cellId.charAt(0).charCodeAt(0) - 65;
            const y = cellId.charAt(1).charCodeAt(0) - 65;
            console.log(`x:${x} y:${y}`);

            const { [selectedShip]: ship } = shipInfo;
            const cellCount = ship.cellCount;

            console.log("cell count: " + cellCount);

            if (shipDirection === 'Horizontal') {
                //direction set as horizontal
                //check left
                if (y + cellCount <= Values.GRID_SIZE) {
                    //add cellCount-1 cells to the right
                    for (let i = 0; i < cellCount; i++) {
                        validCellIds.push(String.fromCharCode(x + 65, y + i + 65));
                    }

                } else { //check right
                    //add cellCount-1 cells to the left
                    for (let i = 0; i < cellCount; i++) {
                        validCellIds.push(String.fromCharCode(x + 65, y - i + 65));
                    }
                }

            } else {
                //direction set as vertical
                //check down
                if (x + cellCount <= Values.GRID_SIZE) {
                    //add cellCount-1 cells to the bottom
                    for (let i = 0; i < cellCount; i++) {
                        validCellIds.push(String.fromCharCode(x + i + 65, y + 65));
                    }

                } else { //check up
                    //add cellCount-1 cells to the top
                    for (let i = 0; i < cellCount; i++) {
                        validCellIds.push(String.fromCharCode(x - i + 65, y + 65));
                    }
                }
            }

            //TODO: Validate for already placed Cells

            setSelectedCells(validCellIds);
        }
    }

    const cellClickAction = () => {
        //process the selected cells for the selected ship

        if (!selectedShip) {
            if (placedShipCount === Values.TOTAL_SHIP_COUNT) {
                //all ships already selected
                alert(`All ships selected, Start the Game!`)
            } else {
                //no ship selected, throw an error
                alert(`No Ship selected. Select one from the list!`); //TODO: Convert this to a custom modal
            }
        } else {
            //update the placedCell Array
            setPlacedCells([...placedCells, ...selectedCells]); //keep in mind to spread the selectedCells or it will get added as array of arrays
            //increment placed ship count
            setPlacedShipCount(prevPlacedShipCount => ++prevPlacedShipCount);

            //update ship info with cell positions and shipPlaced as true
            const newShipInfo = shipInfo;
            newShipInfo[selectedShip].shipPlaced = true;
            newShipInfo[selectedShip].cells = selectedCells;
            setShipInfo(newShipInfo);

            //reset selected items
            setSelectedCells([]);
            setSelectedShip('');
        }
    }

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < Values.GRID_SIZE; i++) {
            const row = [];
            for (let j = 0; j < Values.GRID_SIZE; j++) {
                const cellId = String.fromCharCode(65 + i, 65 + j);
                row.push(
                    <td key={cellId} cell-id={cellId} role="button" className={`cell p-4 fw-lighter ${selectGridCellBgColor(cellId)}`}
                        onMouseOver={() => cellMouseEnterAction(cellId)} onClick={() => cellClickAction()} style={{ maxWidth: '10%', maxHeight: '10%' }}>{cellId}</td>
                );
            }
            grid.push(
                <tr className="" key={i}>{row}</tr>
            );
        }
        return grid;
    }

    const renderShipPlacementStatusMsg = () => {
        if (placedShipCount === Values.TOTAL_SHIP_COUNT) {
            return Msg.ALL_SHIPS_PLACED;
        } else if (selectedShip) {
            return `${shipInfo[selectedShip].shipName} selected. Place it on the Grid now!`;
        } else {
            return Msg.NO_SHIP_SELECTED;
        }
    }

    const setGridForPlayer = () => {
        setGridSetupMode(true);
    }

    const selectAShip = (ship) => {
        setSelectedShip(ship);
    }

    const selectGridCellBgColor = (cellId) => {
        if (placedCells.includes(cellId)) {
            //TODO: see if we can make this logic better/faster
            if (shipInfo.carrier.cells.length > 0 && shipInfo.carrier.cells.includes(cellId)) return shipInfo.carrier.bgcolor;
            if (shipInfo.battleship.cells.length > 0 && shipInfo.battleship.cells.includes(cellId)) return shipInfo.battleship.bgcolor;
            if (shipInfo.destroyer.cells.length > 0 && shipInfo.destroyer.cells.includes(cellId)) return shipInfo.destroyer.bgcolor;
            if (shipInfo.submarine.cells.length > 0 && shipInfo.submarine.cells.includes(cellId)) return shipInfo.submarine.bgcolor;
            if (shipInfo.patrolboat.cells.length > 0 && shipInfo.patrolboat.cells.includes(cellId)) return shipInfo.patrolboat.bgcolor;
        }
        if (!selectedShip) {
            return 'cell-bg-invalidposition';
        }
        if (selectedCells.includes(cellId)) {
            return 'cell-bg-validposition';
        }
    }

    return (
        <div>
            <h4 className="my-4">Let's Play Battleship</h4>
            <div className="row">
                <div className="col-4">
                    {gameRules()}
                </div>
                <div className="col-8">
                    {/* This (Actual Grid UI and gameplay) can be another child component altogether - implement after learning React-Redux */}
                    {/* <Grid rows={Values.GRID_SIZE} cols={Values.GRID_SIZE} data={}/> */}

                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-6 mx-auto">
                                <table onMouseOut={() => setSelectedCells([])} className="table table-bordered table-info">
                                    <tbody>
                                        {renderGrid()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className={gridSetupMode ? 'col-12' : 'd-none'}>
                {/* This (Grid Setup - Ship Placement) can be another child component altogether - implement after learning React-Redux */}
                <div className="mx-auto col-12">
                    <h5 className="mt-2 fw-bold mb-4">Setup the below ships on the Battlefield:</h5>
                    <div className="row">
                        <div className="col-6 ps-5">
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="carrier" type="button" onClick={() => selectAShip("carrier")} disabled={shipInfo.carrier.shipPlaced}>
                                    {shipInfo.carrier.shipName}<span className="badge rounded-pill bg-danger ms-2">{shipInfo.carrier.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShip === 'carrier' ? "badge bg-warning text-dark mt-2" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.carrier.shipPlaced ? "badge bg-success mt-2" : "d-none"}>{`Placed: ${shipInfo.carrier.cells}`}</span>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="battleship" type="button" onClick={() => selectAShip("battleship")} disabled={shipInfo.battleship.shipPlaced}>
                                    {shipInfo.battleship.shipName}<span className="badge rounded-pill bg-warning text-dark ms-2">{shipInfo.battleship.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShip === 'battleship' ? "badge bg-warning text-dark mt-2" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.battleship.shipPlaced ? "badge bg-success mt-2" : "d-none"}>{`Placed: ${shipInfo.battleship.cells}`}</span>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="destroyer" type="button" onClick={() => selectAShip("destroyer")} disabled={shipInfo.destroyer.shipPlaced}>
                                    {shipInfo.destroyer.shipName}<span className="badge rounded-pill bg-primary ms-2">{shipInfo.destroyer.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShip === 'destroyer' ? "badge bg-warning text-dark mt-2" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.destroyer.shipPlaced ? "badge bg-success mt-2" : "d-none"}>{`Placed: ${shipInfo.destroyer.cells}`}</span>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="submarine" type="button" onClick={() => selectAShip("submarine")} disabled={shipInfo.submarine.shipPlaced}>
                                    {shipInfo.submarine.shipName}<span className="badge rounded-pill bg-info text-dark ms-2">{shipInfo.submarine.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShip === 'submarine' ? "badge bg-warning text-dark mt-2" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.submarine.shipPlaced ? "badge bg-success mt-2" : "d-none"}>{`Placed: ${shipInfo.submarine.cells}`}</span>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="patrolboat" type="button" onClick={() => selectAShip("patrolboat")} disabled={shipInfo.patrolboat.shipPlaced}>
                                    {shipInfo.patrolboat.shipName}<span className="badge rounded-pill bg-success ms-2">{shipInfo.patrolboat.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShip === 'patrolboat' ? "badge bg-warning text-dark mt-2" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.patrolboat.shipPlaced ? "badge bg-success mt-2" : "d-none"}>{`Placed: ${shipInfo.patrolboat.cells}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <p className={placedShipCount < Values.TOTAL_SHIP_COUNT ? 'fs-6 mt-2 fw-bold text-danger' : 'fs-4 mt-5 fw-bold text-success'}>
                                {renderShipPlacementStatusMsg()}</p>
                            <p className={placedShipCount < Values.TOTAL_SHIP_COUNT ? 'fs-5 fw-bold text-danger' : 'd-none'}>{placedShipCount}/{Values.TOTAL_SHIP_COUNT} ship(s) placed on the Battlefield</p>
                            <div className={placedShipCount < Values.TOTAL_SHIP_COUNT ? 'row mt-4 justify-content-center' : 'd-none'}>
                                <h6 className="fw-bold mb-2 col-3 d-flex">Ship direction: </h6>
                                <div className="form-check d-flex col-3">
                                    <input className="form-check-input" type="radio" name="flexRadioShipDirection" id="flexRadioShipDirectionHorizontal"
                                        checked={shipDirection === "Horizontal" ? true : false} onChange={() => setShipDirection('Horizontal')}></input>
                                    <label className="form-check-label ps-2" htmlFor="flexRadioShipDirectionHorizontal">Horizontal</label>
                                </div>
                                <div className="form-check d-flex col-3">
                                    <input className="form-check-input" type="radio" name="flexRadioShipDirection" id="flexRadioShipDirectionVertical"
                                        checked={shipDirection === "Vertical" ? true : false} onChange={() => setShipDirection('Vertical')} />
                                    <label className="form-check-label ps-2" htmlFor="flexRadioShipDirectionVertical">Vertical</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <button type="button" className="col-4 btn btn-warning fw-bold my-4 btn-lg me-2" onClick={(e) => alert('Are you sure you want to restart the grid setup?')}>Reset the Grid</button>
                                <button type="button" className='col-7 btn btn-success fw-bold my-4 btn-lg' disabled={!placedShipCount === Values.TOTAL_SHIP_COUNT} onClick={(e) => alert('Grid setup done!')}>Start the Game</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" className={gridSetupMode ? 'd-none' : 'btn btn-success mt-2 btn-lg'} onClick={setGridForPlayer}>Set your Grid</button>
            </div>
        </div>
    )
}

export default GamePlay;

//TODOs...
//disable to placed cell to not be able to clicked, same for when a ship isn't selected - remove pointers too?
//proper already placed cell validation for the new ships to be placed
//Implement 'Reset the Game'
//Implement 'Start the Game'
//The placement badges are coming in the middle, get it on the left