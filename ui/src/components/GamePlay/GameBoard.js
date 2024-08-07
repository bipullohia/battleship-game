import { useEffect, useRef, useState } from "react"
import { DefaultMessages as Msg } from "../../utils/constants";
import { Props as Values } from "../../utils/constants"
import { Stomp } from '@stomp/stompjs'
import SockJS from "sockjs-client";
import './GameBoard.css'

const GamePlay = () => {

    //to store various state objects for grid setup
    const [gridSetupMode, setGridSetupMode] = useState(false);
    const [placedShipCount, setPlacedShipCount] = useState(0);
    const [shipDirection, setShipDirection] = useState('Horizontal'); //default direction
    const [selectedShip, setSelectedShip] = useState('');
    const [selectedCells, setSelectedCells] = useState([]);
    const [placedCells, setPlacedCells] = useState([]);

    //to store various game related info while it's running
    const [gameId, setGameId] = useState('');
    // const [playerCells, setPlayerCells] = useState('');
    // const [opponentCells, setOpponentCells] = useState('');
    
    //websocket connection details
    const [isWSConnected, setIsWSConnected] = useState(false);
    const stompClientRef = useRef(null); //for ws connection

    const defaultShipInfo = {
        carrier: {
            shipName: "Carrier",
            bgcolorPlaced: 'cell-bg-placedposition-carrier',
            bgColorHovered: 'cell-bg-validposition-carrier',
            shipPlaced: false,
            cellCount: 5,
            cells: [],
        },
        battleship: {
            shipName: "BattleShip",
            bgcolorPlaced: 'cell-bg-placedposition-battleship',
            bgColorHovered: 'cell-bg-validposition-battleship',
            shipPlaced: false,
            cellCount: 4,
            cells: []
        },
        destroyer: {
            shipName: "Destroyer",
            bgcolorPlaced: 'cell-bg-placedposition-destroyer',
            bgColorHovered: 'cell-bg-validposition-destroyer',
            shipPlaced: false,
            cellCount: 3,
            cells: []
        },
        submarine: {
            shipName: "Submarine",
            bgcolorPlaced: 'cell-bg-placedposition-submarine',
            bgColorHovered: 'cell-bg-validposition-submarine',
            shipPlaced: false,
            cellCount: 3,
            cells: []
        },
        patrolboat: {
            shipName: "Patrol Boat",
            bgcolorPlaced: 'cell-bg-placedposition-patrolboat',
            bgColorHovered: 'cell-bg-validposition-patrolboat',
            shipPlaced: false,
            cellCount: 2,
            cells: []
        }
    }

    //ship placements on the grid
    const [shipInfo, setShipInfo] = useState({ ...defaultShipInfo });

    //opposition's ship placement ***TEMPORARY***
    // const [shipInfoOpp, setShipInfoOpp] = useState();

    useEffect(() => {
        //cleanup func to close ws connection when component unmounts
        return () => {
            if(stompClientRef.current){
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    const initiateWSConnection = () => {
        const socket = new SockJS('http://localhost:8080/game/battleship/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            console.log("Connected to game websocket: " + frame);
            setIsWSConnected(true);
            
            stompClient.subscribe('/play/public', (msg) => {
                console.log("Message from ws game server: " + msg.body);
            });
        }, (error) => {
            console.log("Error while connection to game websocket: ", error);
            setIsWSConnected(false);
        });

        stompClientRef.current = stompClient;
    }

    const sendGameMove = (cellId) => {
        if(stompClientRef.current && stompClientRef.current.connected){
            stompClientRef.current.send('/action/move', {}, JSON.stringify({
                'gameId': gameId,
                'player': 'player',
                'cellId': cellId
            }));
        }
    };

    const gameRules = () => {
        return (
            <div className="ms-5">
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
                <button type="button" className={gridSetupMode ? 'd-none' : 'btn btn-success mt-5 btn-lg'} onClick={() => setGridSetupMode(true)}>Set your Grid</button>
                <button type="button" className={gridSetupMode ? 'btn btn-danger mt-5 btn-lg' : 'd-none'} onClick={() => restartGame()}>Start from Beginning</button>
            </div>
        )
    }

    const cellHoverAction = (cellId) => {
        if (selectedShip && !placedCells.includes(cellId)) {
            let validCells = [];
            const { [selectedShip]: ship } = shipInfo;
            const cellCount = ship.cellCount;
            const x = cellId.charAt(0).charCodeAt(0) - 65;
            const y = cellId.charAt(1).charCodeAt(0) - 65;

            if (shipDirection === 'Horizontal') {
                validCells = getValidHorizontalCells(x, y, cellCount);
                if (validCells.length < cellCount) {
                    validCells = [];
                    validCells = getValidVerticalCells(x, y, cellCount);
                }
            } else {
                validCells = getValidVerticalCells(x, y, cellCount);
                if (validCells.length < cellCount) {
                    validCells = [];
                    validCells = getValidHorizontalCells(x, y, cellCount);
                }
            }

            if (validCells.length === cellCount)
                setSelectedCells(validCells);
        }
    }

    const getValidHorizontalCells = (x, y, cellCount) => {
        let validHCells = [];
        let count = 0;
        //check right side for empty cells (including self)
        for (let i = 0; i < cellCount && y + i < Values.GRID_SIZE; i++) {
            const cell = String.fromCharCode(x + 65, y + i + 65);
            if (!placedCells.includes(cell)) {
                validHCells.push(cell);
                count++;
            } else {
                //we can't continue in this direction
                break;
            }
        }

        //check left side for empty cells (atleast 1 cell {self} has been added to the validHCells
        for (let i = 1; i <= cellCount - count && y - i >= 0; i++) {
            const cell = String.fromCharCode(x + 65, y - i + 65);
            if (!placedCells.includes(cell)) {
                validHCells.push(cell);
            } else {
                //we can't continue in this direction
                break;
            }
        }
        return validHCells;
    }

    const getValidVerticalCells = (x, y, cellCount) => {
        let validVCells = [];
        let count = 0;
        //check bottom side for empty cells (including self)
        for (let i = 0; i < cellCount && x + i < Values.GRID_SIZE; i++) {
            const cell = String.fromCharCode(x + i + 65, y + 65);
            if (!placedCells.includes(cell)) {
                validVCells.push(cell);
                count++;
            } else {
                //we can't continue in this direction
                break;
            }
        }

        //check up side for empty cells (atleast 1 cell {self} has been added to the validVCells
        for (let i = 1; i <= cellCount - count && x - i >= 0; i++) {
            const cell = String.fromCharCode(x - i + 65, y + 65);
            if (!placedCells.includes(cell)) {
                validVCells.push(cell);
            } else {
                //we can't continue in this direction
                break;
            }
        }
        return validVCells;
    }

    const cellClickAction = (cellId) => {
        //if the cell already has a ship, don't do anything (or show up a modal/warning???)
        if (!placedCells.includes(cellId)) {
            //process the selected cells for the selected ship
            if (!selectedShip) {
                if (placedShipCount === Values.TOTAL_SHIP_COUNT) {
                    //all ships already selected
                    alert(`All ships selected, Start the Game!`)
                } else {
                    //no ship selected, throw an error
                    alert(`No Ship selected. Select one from the list!`); //TODO: Convert this to a custom modal
                }
            } else if (shipInfo[selectedShip].cellCount === selectedCells.length) { //this should only be clicked when we have a proper array of cells selected
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
            } else {
                alert('Ship cannot be placed on this cell, choose another cell!');
            }
        }
    }

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < Values.GRID_SIZE; i++) {
            const row = [];
            for (let j = 0; j < Values.GRID_SIZE; j++) {
                const cellId = String.fromCharCode(65 + i, 65 + j);
                row.push(
                    <td key={cellId} cell-id={cellId} className={`cell p-4 fw-lighter ${selectGridCellBgColor(cellId)}`}
                        onMouseOver={() => cellHoverAction(cellId)} onClick={() => cellClickAction(cellId)} style={{ maxWidth: '10%', maxHeight: '10%' }}>{cellId}</td>
                );
            }
            grid.push(
                <tr className="" key={i}>{row}</tr>
            );
        }
        return grid;
    }

    const renderGameplayGrid = () => {
        const grid = [];
        for (let i = 0; i < Values.GRID_SIZE; i++) {
            const row = [];
            for (let j = 0; j < Values.GRID_SIZE; j++) {
                const cellId = String.fromCharCode(65 + i, 65 + j);
                row.push(
                    <td key={cellId} cell-id={cellId} onClick={() => sendGameMove(cellId)} className={`cell p-4 fw-lighter`}
                        style={{ maxWidth: '10%', maxHeight: '10%' }}>{cellId}</td>
                );
            }
            grid.push(
                <tr className="" key={i}>{row}</tr>
            );
        }
        return grid;
    }

    const renderShipPlacementStatusMsg = () => {
        //depending on the ship placement/selected status - render a alert message
        if (placedShipCount === Values.TOTAL_SHIP_COUNT) {
            return (<div className="alert alert-success" role="alert">{Msg.ALL_SHIPS_PLACED}</div>)
        } else if (selectedShip) {
            return (<div className="alert alert-primary" role="alert">{shipInfo[selectedShip].shipName} selected. Place it on the Battlefield now!</div>);
        } else {
            return (<div className="alert alert-danger" role="alert">{Msg.NO_SHIP_SELECTED}</div>);
        }
    }

    const restartGame = () => {
        setGridSetupMode(false);
        resetGrid();
        // setShipInfoOpp();
    }

    const selectAShip = (ship) => {
        setSelectedShip(ship);
    }

    const selectGridCellBgColor = (cellId) => {
        //not allowed to place a ship on a cell which already has a ship
        if (placedCells.includes(cellId)) {
            for (const shipKey in shipInfo) {
                const ship = shipInfo[shipKey];
                if (ship.cells.length > 0 && ship.cells.includes(cellId)) return ship.bgcolorPlaced + ' cursor-notallowed';
            }
        }
        //no ship selected - select a ship
        if (!selectedShip) {
            return 'cell-bg-invalidposition cursor-notallowed';
        }
        //cell is a part of selected cell - show proper ship color
        if (selectedCells.includes(cellId)) {
            const ship = shipInfo[selectedShip];
            return ship.bgColorHovered + ' cursor-pointer';
        }
        //other - like the cell position isn't sufficient for the selected ship
        return 'cell-bg-invalidposition cursor-notallowed';
    }

    //***TEMPORARY***
    // const selectOppositionGridBgColor = (cellId) => {
    //     for (const shipKey in shipInfoOpp) {
    //         const ship = shipInfoOpp[shipKey];
    //         if (ship.cells.length > 0 && ship.cells.includes(cellId)) return defaultShipInfo[shipKey].bgcolorPlaced;
    //     }
    // }

    const resetGrid = () => {
        //set state variables to default
        setPlacedShipCount(0);
        setShipDirection('Horizontal');
        setSelectedShip('');
        setSelectedCells([]);
        setPlacedCells([]);

        //restore ship status
        setShipInfo({ ...defaultShipInfo });
    }

    const startGame = async (e) => {
        //make a fetch api call to the server to send ship placement details and start a game session with computer
        e.preventDefault();

        //form the json object we want to send
        const newgame = {
            "opponentType": "computer",
            "shipCollectionPlayer1": {
                "carrier": {
                    "cells": shipInfo.carrier.cells
                },
                "battleship": {
                    "cells": shipInfo.battleship.cells
                },
                "destroyer": {
                    "cells": shipInfo.destroyer.cells
                },
                "submarine": {
                    "cells": shipInfo.submarine.cells
                },
                "patrolboat": {
                    "cells": shipInfo.patrolboat.cells
                }
            }
        }

        try {
            const response = await fetch('http://localhost:8080/game/battleship/http/startgame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newgame)
            });

            if (!response.ok) {
                throw new Error(`Error!  + ${response.status}`);
            }

            const result = await response.json();
            console.log(`Http resp: ' + ${JSON.stringify(result)}`);

            if (result && result.gameId) {
                setGameId(result.gameId);

                //we have the gameId, we are ready to start game. Establish a ws connection
                initiateWSConnection();
            }

            // //***TEMPORARY*** only for debug purposes
            // if(result.shipCollectionPlayer2){
            //     setShipInfoOpp(result.shipCollectionPlayer2);
            // }

        } catch (error) {
            console.error(`Error caught: ${error}`);
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
                                    <span className={shipInfo.submarine.shipPlaced ? "badge bg-success mt-2 position-relative start-0" : "d-none"}>{`Placed: ${shipInfo.submarine.cells}`}</span>
                                </div>
                            </div>
                            <div className="row mb-2 justify-content-center">
                                <button className="col-4 fw-bold btn btn-outline-dark" id="patrolboat" type="button" onClick={() => selectAShip("patrolboat")} disabled={shipInfo.patrolboat.shipPlaced}>
                                    {shipInfo.patrolboat.shipName}<span className="badge rounded-pill bg-success ms-2">{shipInfo.patrolboat.cellCount} cells</span> </button>
                                <div className="form-group col-4">
                                    <span className={selectedShip === 'patrolboat' ? "badge bg-warning text-dark mt-2" : "d-none"}>Currently Selected</span>
                                    <span className={shipInfo.patrolboat.shipPlaced ? "badge bg-success mt-2 position-relative start-0" : "d-none"}>{`Placed: ${shipInfo.patrolboat.cells}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            {renderShipPlacementStatusMsg()}
                            <p className={placedShipCount < Values.TOTAL_SHIP_COUNT ? 'fs-5 fw-bold text-danger' : 'd-none'}>{placedShipCount}/{Values.TOTAL_SHIP_COUNT} ship(s) placed on the Battlefield</p>
                            <div className={placedShipCount < Values.TOTAL_SHIP_COUNT ? 'row mt-4 justify-content-center' : 'd-none'}>
                                <h6 className="fw-bold mb-2 col-5 d-flex">Ship direction preference: </h6>
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
                                <button type="button" className="col-4 btn btn-warning fw-bold my-4 btn-lg me-2" onClick={() => resetGrid()}>Reset the Grid</button>
                                <button type="button" className='col-7 btn btn-success fw-bold my-4 btn-lg' disabled={placedShipCount !== Values.TOTAL_SHIP_COUNT} onClick={(e) => startGame(e)}>Start the Game</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ***TEMPORARY***
            <div className={shipInfoOpp ? 'col-4 mt-5' : 'd-none'}>
                <h6>Opposition's Grid...</h6>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6 mx-auto">
                            <table className="table table-bordered table-info">
                                <tbody>
                                    {renderOppositionGrid()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> 
            */}

            {/* Game Play Grid */}
            <div className={gameId ? 'col-4 mt-5' : 'd-none'}>
                <h5>Play Game...</h5>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-6 mx-auto">
                            <table className="table table-bordered table-info">
                                <tbody>
                                    {renderGameplayGrid()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GamePlay;

//TODOs...
//Implement 'Start the Game'
//The placement badges are coming in the middle, get it on the left
//right click to change ship direction - show cursor as vertical bidirectional arrow or horizontal bidrectional arrow
//Implement Toasts/Modals for the alerts/error messages
//'Setup the below Warships on the Battlefield' should come on the left
//Start the Game should have a tooltip on cursor hover - 'Place the remaining x ships to start the game'
//Tooltips for all the buttons/ ships, etc.
//hide the grid setup once game is started - and display an empty grid!


//Game chat only possible in a game room. Or maybe we want a public game room too for everyone?
//whenever a game is started - a new WS connection should be established!! 

//if a player is refreshing the page - get all the info via a new websocket call and populate the info in the ui
//the timer will start from the time left in the game (via redis ttl)