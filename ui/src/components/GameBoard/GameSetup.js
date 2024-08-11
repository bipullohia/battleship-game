import { CONSTANT_PROPS, HTTP_CONFIG, MESSAGES } from "../../utils/constants";
import { useSelector } from "react-redux";

const GameSetup = ({ gameSetupProps }) => {
    const { selectedShip, shipDirection, placedShipCount,
        initiateWSConnectionForGame, resetGrid, setSelectedShip, setShipDirection
    } = gameSetupProps;

    const shipInfo = useSelector((state) => state.shipInfo);

    const selectAShip = (ship) => {
        setSelectedShip(ship);
    }

    const renderShipPlacementStatusMsg = () => {
        //depending on the ship placement/selected status - render a alert message
        if (placedShipCount === CONSTANT_PROPS.TOTAL_SHIP_COUNT) {
            return (<div className="alert alert-success" role="alert">{MESSAGES.ALL_SHIPS_PLACED}</div>)
        } else if (selectedShip) {
            return (<div className="alert alert-primary" role="alert">{shipInfo[selectedShip].shipName} selected. Place it on the Battlefield now!</div>);
        } else {
            return (<div className="alert alert-danger" role="alert">{MESSAGES.NO_SHIP_SELECTED}</div>);
        }
    }

    //make a fetch api call to the server to send ship placement details and start a game session with computer
    const startGame = async (e) => {
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
            const response = await fetch(HTTP_CONFIG.URL + HTTP_CONFIG.PATH_START_GAME, {
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
                //setGameId(result.gameId); TODO: set this gameId in the session or store
                console.log(result.gameId);

                //we have the gameId, we are ready to start game. Establish a ws connection
                initiateWSConnectionForGame();
            }
        } catch (error) {
            console.error(`Error caught: ${error}`);
        }
    }


    return (
        <div className={'col-12'}>
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
                        <p className={placedShipCount < CONSTANT_PROPS.TOTAL_SHIP_COUNT ? 'fs-5 fw-bold text-danger' : 'd-none'}>{placedShipCount}/{CONSTANT_PROPS.TOTAL_SHIP_COUNT} ship(s) placed on the Battlefield</p>
                        <div className={placedShipCount < CONSTANT_PROPS.TOTAL_SHIP_COUNT ? 'row mt-4 justify-content-center' : 'd-none'}>
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
                            <button type="button" className='col-7 btn btn-success fw-bold my-4 btn-lg' disabled={placedShipCount !== CONSTANT_PROPS.TOTAL_SHIP_COUNT} onClick={(e) => startGame(e)}>Start the Game</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameSetup;

//Folder structure for store related stuff
/*
src/
  store/
    index.js           // Main store configuration
    rootReducer.js     // Combines all reducers (if you have multiple slices)
    slices/
      shipInfoSlice.js
      otherSlice1.js
      otherSlice2.js
    actions/           // If you have any action creators separate from slices
      index.js
    selectors/         // For complex selectors
      shipInfoSelectors.js
    middleware/        // For any custom middleware
      loggingMiddleware.js
*/