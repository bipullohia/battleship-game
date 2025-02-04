import { useSelector } from "react-redux";
import PrimaryPlayerGrid from "./PrimaryPlayerGrid";
import SecondaryPlayerGrid from "./SecondaryPlayerGrid";


const GameArea = () => {
    const gameId = useSelector((state) => state.gameInfo.gameId);
    const wsconnected = useSelector((state) => state.websocket.connected);

    const abortGame = () => {
        alert('Abort game?');
        /*
            Aborting the game does following things:
                0. confirm if user is willing to abort the game
                1. sends a api call to the backend to delete this gameId from redis
                2. close the websocket connection if chat is not alive
                3. set the gameId back to null and make sure user is redirected to game setup page
        */
    }

    return (
        <div>
            <div className="row">
                <div className="col-4">
                    <SecondaryPlayerGrid />
                </div>
                <div className="col-8">
                    <PrimaryPlayerGrid />
                </div>

            </div>
            <div className="row">
                <div className="mt-5">
                    <div className="badge mt-5 bg-warning text-dark">GameId: {gameId}</div>
                    <div>
                        <button type="button" className="col-3 btn btn-danger fw-bold my-3" onClick={() => abortGame()}>Abort Game</button>
                    </div>
                    <div>
                        <div className="fw-light">Websocket Connected: {wsconnected ? 'Yes': 'No'}</div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default GameArea;