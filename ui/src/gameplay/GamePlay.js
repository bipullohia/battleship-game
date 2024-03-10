import Grid from "./Grid";

function GamePlay() {

    const gameRules = () => {
        return (
            <div className="mx-auto  ms-5">
                <h6 className="mt-5 fw-bold">Game Rules...</h6>
                <ol className="text-start">
                    <li>We are playing a classic game of 'BattleShip'</li>
                    <li>Setup your board by placing all the warships in the ocean</li>
                    <li>Try to place it in such a way that it is harder for your opponent to guess it</li>
                    <li>In the meantime, your opponent will also be setting up their own grid</li>
                    <li>Once the game starts, the first to sink all the ships of the opponent wins!</li>
                </ol>
            </div>
        )
    }

    return (
        <div>
            <h4 className="my-4">Let's Play Battleship</h4>
            <div className="row">
                <div className="col-4">
                    {gameRules()}
                </div>
                <div className="col-8">
                    <Grid rows={10} cols={10} />
                </div>
            </div>
            <button type="button" className='btn btn-success mt-2 btn-lg'>Set your Grid</button>
        </div>
    )
}

export default GamePlay;