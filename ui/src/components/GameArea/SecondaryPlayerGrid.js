import { CONSTANT_PROPS } from "../../utils/constants";
import '../../styles/CellBGColors.css'
import { useSelector } from "react-redux";

const SecondaryPlayerGrid = () => {

    const gameInfo = useSelector(state => state.gameInfo);

    const selectGridCellBgColor = (cellId) => {
        let shipPlacedColor = "";

        //check for placed ship to give bg color (we may have other items here)
        if(gameInfo.shipCollectionPlayer1.carrier.cells.find(cell => cell===cellId)){
            shipPlacedColor = 'cell-bg-validposition-carrier';            
        }else if(gameInfo.shipCollectionPlayer1.battleship.cells.find(cell => cell===cellId)){
            shipPlacedColor = 'cell-bg-validposition-battleship ';
        }else if(gameInfo.shipCollectionPlayer1.destroyer.cells.find(cell => cell===cellId)){
            shipPlacedColor = 'cell-bg-validposition-destroyer';
        }else if(gameInfo.shipCollectionPlayer1.submarine.cells.find(cell => cell===cellId)){
            shipPlacedColor = 'cell-bg-validposition-submarine';
        }else if(gameInfo.shipCollectionPlayer1.patrolboat.cells.find(cell => cell===cellId)){
            shipPlacedColor = 'cell-bg-validposition-patrolboat';
        }else shipPlacedColor = 'cell-bg-secondarygrid-default';

        return shipPlacedColor;
    }

    const isCellHitByOpponent = (cellId) => {
        if(gameInfo.hitCells.find(cell => cell===cellId)){
            return 'x';
        }else{
            return cellId;
        }
    }

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < CONSTANT_PROPS.GRID_SIZE; i++) {
            const row = [];
            for (let j = 0; j < CONSTANT_PROPS.GRID_SIZE; j++) {
                const cellId = String.fromCharCode(65 + i, 65 + j);
                row.push(
                    <td key={cellId} cell-id={cellId} className={`cell p-4 fw-lighter ${selectGridCellBgColor(cellId)}`}
                        style={{ maxWidth: '10%', maxHeight: '10%' }}>{isCellHitByOpponent(cellId)}</td>
                );
            }
            grid.push(
                <tr className="" key={i}>{row}</tr>
            );
        }
        return grid;
    }

    return (
        <div className="container-fluid mt-4">
            <h5 className="fw-bold">Your Battlefield</h5>
            <div className="fw-light">It has the ships placed by you</div>
            <div className="row mt-3 mb-1">
                <div className="col-6 mx-auto">
                    <table className="table table-bordered table-info">
                        <tbody>
                            {renderGrid()}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>Ships sunk: 0/5</div>
        </div>
    )
}

export default SecondaryPlayerGrid;