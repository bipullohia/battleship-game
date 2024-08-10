import { useEffect, useRef, useState } from "react"
import { DEFAULT_SHIP_INFO, CONSTANT_PROPS, WS_CONFIG, MESSAGES } from "../../utils/constants";
import { Stomp } from '@stomp/stompjs'
import SockJS from "sockjs-client";
import './GameBoard.css'
import Grid from "./Grid";
import GameSetup from "./GameSetup.js";

const GamePlay = () => {

    //to store various state objects for grid setup
    const [gridSetupMode, setGridSetupMode] = useState(false);
    const [placedShipCount, setPlacedShipCount] = useState(0);
    const [shipDirection, setShipDirection] = useState(CONSTANT_PROPS.DEFAULT_SHIP_DIRECTION);
    const [selectedShip, setSelectedShip] = useState('');
    const [selectedCells, setSelectedCells] = useState([]);
    const [placedCells, setPlacedCells] = useState([]);

    //ship placements on the grid
    const [shipInfo, setShipInfo] = useState({ ...DEFAULT_SHIP_INFO });

    //websocket connection details
    const stompClientRef = useRef(null); //for ws connection

    useEffect(() => {
        //cleanup func to close ws connection when component unmounts
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    
    const initiateWSConnection = () => {
        const socket = new SockJS(WS_CONFIG.URL);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            console.log("Connected to game websocket: " + frame);
            stompClient.subscribe(WS_CONFIG.READ_PATH_GAMEMOVE, (msg) => {
                console.log("Message from ws game server: " + msg.body);
            });
        }, (error) => {
            console.log("Error while connection to game websocket: ", error);
        });

        stompClientRef.current = stompClient;
    }

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
            </div>
        )
    }
    
    const restartGame = () => {
        setGridSetupMode(false);
        resetGrid();
    }
    
    const resetGrid = () => {
        //set state variables to default
        setPlacedShipCount(0);
        setShipDirection(CONSTANT_PROPS.DEFAULT_SHIP_DIRECTION);
        setSelectedShip('');
        setSelectedCells([]);
        setPlacedCells([]);
        //restore ship status
        setShipInfo({ ...DEFAULT_SHIP_INFO });
    }

    const gridProps = {
        shipInfo: shipInfo,
        shipDirection: shipDirection,
        selectedShip: selectedShip,
        selectedCells: selectedCells,
        placedCells: placedCells,
        placedShipCount: placedShipCount,
        setShipInfo: setShipInfo,
        setSelectedShip: setSelectedShip,
        setSelectedCells: setSelectedCells,
        setPlacedCells: setPlacedCells,
        setPlacedShipCount: setPlacedShipCount
    }

    const gameSetupProps = {
        stompClientRef: stompClientRef,
        shipInfo: shipInfo,
        selectedShip: selectedShip,
        shipDirection: shipDirection,
        placedShipCount: placedShipCount,
        initiateWSConnection: initiateWSConnection,
        resetGrid: resetGrid,
        setSelectedShip: setSelectedShip,
        setShipDirection: setShipDirection
    }

    return (
        <div>
            <h4 className="my-4">{MESSAGES.GAME_HEADER}</h4>
            <div className="row">
                <div className="col-4">
                    {gameRules()}
                    <button type="button" className={gridSetupMode ? 'd-none' : 'btn btn-success mt-5 btn-lg'} onClick={() => setGridSetupMode(true)}>Set your Grid</button>
                    <button type="button" className={gridSetupMode ? 'btn btn-danger mt-5 btn-lg' : 'd-none'} onClick={() => restartGame()}>Start from Beginning</button>
                </div>
                <div className="col-8">
                    <Grid gridProps={gridProps}/>
                </div>
            </div>
            {gridSetupMode ? <GameSetup gameSetupProps={gameSetupProps}/> : null}
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