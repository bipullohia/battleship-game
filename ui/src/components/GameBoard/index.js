import { useEffect, useState } from "react"
import { CONSTANT_PROPS, WS_CONFIG, MESSAGES } from "../../utils/constants";
import '../../styles/CellBGColors.css'
import GameSetupGrid from "./GameSetupGrid.js";
import GameSetup from "./GameSetup.js";
import { useDispatch, useSelector } from "react-redux";
import { resetShipInfo } from "../../store/slices/shipInfoSlice.js";
import { websocketService } from '../../store'

const GameBoard = () => {
    const dispatch = useDispatch();

    //to store various state objects for grid setup
    // const [gridSetupMode, setGridSetupMode] = useState(false);
    const [placedShipCount, setPlacedShipCount] = useState(0);
    const [shipDirection, setShipDirection] = useState(CONSTANT_PROPS.DEFAULT_SHIP_DIRECTION);
    const [selectedShip, setSelectedShip] = useState('');
    const [selectedCells, setSelectedCells] = useState([]);
    const [placedCells, setPlacedCells] = useState([]);

    //for ws connection
    const [isGameOn, setIsGameOn] = useState(false);

    const wsconnected = useSelector((state) => state.websocket.connected);

    useEffect(() => {
        //cleanup func to close ws connection when component unmounts
        return () => {
            if (isGameOn) {
                websocketService.disconnect();
            }
        }
    }, [isGameOn]);

    const initiateWSConnectionForGame = async () => {
        try {
            await websocketService.connect();
            setIsGameOn(true);

            //subscribe to game move responses
            websocketService.subscribe(WS_CONFIG.READ_PATH_GAMEMOVE, (message) => console.log(message));

            //send a sample game move to set the status of the game as 'in progress'
            websocketService.sendMessage(WS_CONFIG.WRITE_PATH_GAMEMOVE, {
                'gameId': 'SampleGameId',
                'player': 'player',
                'cellId': 'Sample'
            });
        } catch (error) {
            console.error('Failed to start game - websocket connection setup issue', error);
        }
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
                <div>WebSocket connected: {wsconnected ? 'Yes' : 'No'}</div>
            </div>
        )
    }

    const resetGrid = () => {
        //set state variables to default
        setPlacedShipCount(0);
        setShipDirection(CONSTANT_PROPS.DEFAULT_SHIP_DIRECTION);
        setSelectedShip('');
        setSelectedCells([]);
        setPlacedCells([]);
        //restore ship status
        dispatch(resetShipInfo());
    }

    const gridProps = {
        shipDirection: shipDirection,
        selectedShip: selectedShip,
        selectedCells: selectedCells,
        placedCells: placedCells,
        placedShipCount: placedShipCount,
        setSelectedShip: setSelectedShip,
        setSelectedCells: setSelectedCells,
        setPlacedCells: setPlacedCells,
        setPlacedShipCount: setPlacedShipCount
    }

    const gameSetupProps = {
        selectedShip: selectedShip,
        shipDirection: shipDirection,
        placedShipCount: placedShipCount,
        initiateWSConnectionForGame: initiateWSConnectionForGame,
        resetGrid: resetGrid,
        setSelectedShip: setSelectedShip,
        setShipDirection: setShipDirection
    }

    return (
        <div>
            <h4 className="my-3">{MESSAGES.GAME_HEADER}</h4>
            <div className="row">
                <div className="col-4">
                    {gameRules()}
                </div>
                <div className="col-8">
                    <GameSetupGrid gridProps={gridProps} />
                </div>
            </div>
            {<GameSetup gameSetupProps={gameSetupProps}/>}
        </div>
    )
}

export default GameBoard;

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

//if a player is refreshing the page - get all the info via a new websocket call and populate the info in the ui
//the timer will start from the time left in the game (via redis ttl)