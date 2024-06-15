import { useState } from "react";
import { DefaultMessages } from "../constants";
import { Props } from "../constants";
import Grid from "./Grid";

function GamePlay() {

    const [gridSetupMode, setGridSetupMode] = useState(true);
    const [actionMsg, setActionMsg] = useState(DefaultMessages.DEFAULT_GRID_ACTION_TEXT);
    const [selectedShipCount, setSelectedShipCount] = useState('0');
    const [shipDirection, setShipDirection] = useState('Horizontal'); //default direction
    const [selectedShipType, setSelectedShipType] = useState('');
    const [selectedShipCellCount, setSelectedShipCellCount] = useState(0);

    //ship placements on the grid
    const [shipInfo, setShipInfo] = useState({
        carrier: {
            shipName: "Carrier",
            shipPlaced: false,
            cellCount: 5,
            startPos: -1,
            endPos: -1
        },
        battleship: {
            shipName: "BattleShip",
            shipPlaced: false,
            cellCount: 4,
            startPos: -1,
            endPos: -1
        },
        destroyer: {
            shipName: "Destroyer",
            shipPlaced: false,
            cellCount: 3,
            startPos: -1,
            endPos: -1
        },
        submarine: {
            shipName: "Submarine",
            shipPlaced: false,
            cellCount: 3,
            startPos: -1,
            endPos: -1
        },
        patrolboat: {
            shipName: "Patrol Boat",
            shipPlaced: false,
            cellCount: 2,
            startPos: -1,
            endPos: -1
        },
    });

    const gameRules = () => {
        return (
            <div className="mx-auto  ms-5">
                <h6 className="mt-5 fw-bold">Game Rules...</h6>
                <ol className="text-start">
                    <li>We are playing a classic game of 'BattleShip'</li>
                    <li>Setup your board by placing all the warships in the ocean</li>
                    <li>Try to place it in such a way that it is harder for your opponent to guess it</li>
                    <li>To place a ship, select a ship and then click on the grid</li>
                    <li>You can select the ship orientation using the radio buttons Horizontal/Vertical</li>
                    <li>In the meantime, your opponent will also be setting up their own grid</li>
                    <li>Once the game starts, the first to sink all the ships of the opponent wins!</li>
                </ol>

                <div className="mt-5">
                    <h5>Ignore these...</h5>
                    <p>Ship direction: {shipDirection}</p>
                    <p>Selected Ship Type: {selectedShipType}</p>
                    <p>Selected Ship Cell Count: {selectedShipCellCount}</p>
                </div>
            </div>
        )
    }

    const setGridForPlayer = () => {
        setGridSetupMode(true);
    }

    const selectAShip = (ship) => {
        const { [ship]: selectedShip } = shipInfo; //using object destructuring
        setActionMsg(`${selectedShip.shipName} selected. Press a cell on the grid to place it...`);
        setSelectedShipType(ship);
        setSelectedShipCellCount(selectedShip.cellCount);
    }

    return (
        <div>
            <h4 className="my-4">Let's Play Battleship</h4>
            <div className="row">
                <div className="col-4">
                    {gameRules()}
                </div>
                <div className="col-8">
                    <Grid rows={Props.GRID_SIZE} cols={Props.GRID_SIZE} />
                </div>
            </div>
            <div className={gridSetupMode ? 'col-12' : 'd-none'}>
                <div className="mx-auto col-12">
                    <h5 className="mt-2 fw-bold mb-4">Setup the below ships on the Battlefield:</h5>
                    <div className="row">
                        <div className="col-6 ps-5">
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="carrier" type="button" onClick={() => selectAShip("carrier")} disabled={shipInfo.carrier.shipPlaced}>
                                    {shipInfo.carrier.shipName}<span className="badge rounded-pill bg-danger ms-2">{shipInfo.carrier.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShipType == 'carrier' ? "badge bg-warning text-dark mt-2 align-middle" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.carrier.shipPlaced ? "badge bg-dark mt-2 align-middle" : "d-none"}>{`${shipInfo.carrier.startPos}-${shipInfo.carrier.endPos}`}</span>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="battleship" type="button" onClick={() => selectAShip("battleship")} disabled={shipInfo.battleship.shipPlaced}>
                                    {shipInfo.battleship.shipName}<span className="badge rounded-pill bg-warning text-dark ms-2">{shipInfo.battleship.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShipType == 'battleship' ? "badge bg-warning text-dark mt-2 align-middle" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.battleship.shipPlaced ? "badge bg-dark mt-2 align-middle" : "d-none"}>{`${shipInfo.battleship.startPos}-${shipInfo.battleship.endPos}`}</span>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="destroyer" type="button" onClick={() => selectAShip("destroyer")} disabled={shipInfo.destroyer.shipPlaced}>
                                    {shipInfo.destroyer.shipName}<span className="badge rounded-pill bg-info text-dark ms-2">{shipInfo.destroyer.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShipType == 'destroyer' ? "badge bg-warning text-dark mt-2 align-middle" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.destroyer.shipPlaced ? "badge bg-dark mt-2 align-middle" : "d-none"}>Ship placed at {`${shipInfo.destroyer.startPos}-${shipInfo.destroyer.endPos}`}</span>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="submarine" type="button" onClick={() => selectAShip("submarine")} disabled={shipInfo.submarine.shipPlaced}>
                                    {shipInfo.submarine.shipName}<span className="badge rounded-pill bg-info text-dark ms-2">{shipInfo.submarine.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShipType == 'submarine' ? "badge bg-warning text-dark mt-2 align-middle" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.submarine.shipPlaced ? "badge bg-dark mt-2 align-middle" : "d-none"}>{`${shipInfo.submarine.startPos}-${shipInfo.submarine.endPos}`}</span>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="patrolboat" type="button" onClick={() => selectAShip("patrolboat")} disabled={shipInfo.patrolboat.shipPlaced}>
                                    {shipInfo.patrolboat.shipName}<span className="badge rounded-pill bg-success ms-2">{shipInfo.patrolboat.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShipType == 'patrolboat' ? "badge bg-warning text-dark mt-2 align-middle" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.patrolboat.shipPlaced ? "badge bg-dark mt-2 align-middle" : "d-none"}>{`${shipInfo.patrolboat.startPos}-${shipInfo.patrolboat.endPos}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <p className="fs-6 mt-2 fw-bold text-danger">{actionMsg}</p>
                            <p className="fs-5 fw-bold text-danger">{selectedShipCount}/5 ship placed on the Battlefield</p>
                            <div className="row mt-4 justify-content-center">
                                <h6 className="fw-bold mb-2 col-3 d-flex">Ship direction: </h6>
                                <div class="form-check d-flex col-3">
                                    <input class="form-check-input" type="radio" name="flexRadioShipDirection" id="flexRadioShipDirectionHorizontal"
                                        checked={shipDirection == "Horizontal" ? true : false} onClick={() => setShipDirection('Horizontal')}></input>
                                    <label class="form-check-label ps-2" for="flexRadioShipDirectionHorizontal">Horizontal</label>
                                </div>
                                <div class="form-check d-flex col-3">
                                    <input class="form-check-input" type="radio" name="flexRadioShipDirection" id="flexRadioShipDirectionVertical"
                                        checked={shipDirection == "Vertical" ? true : false} onClick={() => setShipDirection('Vertical')} />
                                    <label class="form-check-label ps-2" for="flexRadioShipDirectionVertical">Vertical</label>
                                </div>
                            </div>

                            <button type="button" className='col-12 btn btn-success my-5 btn-lg' onClick={(e) => alert('Grid setup done!')}>Done</button>
                        </div>
                    </div>
                </div>
                <button type="button" className={gridSetupMode ? 'd-none' : 'btn btn-success mt-2 btn-lg'} onClick={setGridForPlayer}>Set your Grid</button>
            </div>
        </div>
    )
}

export default GamePlay;