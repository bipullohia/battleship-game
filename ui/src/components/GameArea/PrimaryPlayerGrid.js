import { websocketService } from "../../store";
import { CONSTANT_PROPS, WS_CONFIG } from "../../utils/constants";
import '../../styles/CellBGColors.css'
import { useState } from "react";
import { useSelector } from "react-redux";

const PrimaryPlayerGrid = () => {

    const gameId = useSelector((state) => state.gameInfo.gameId);

    const [hoveredCell, setHoveredCell] = useState(null);

    const sendGameMove = (cellId) => {
        websocketService.sendMessage(WS_CONFIG.WRITE_PATH_GAMEMOVE, {
            'gameId': gameId,
            'player': 'player',
            'cellId': cellId
        });
    }

    const selectGridCellBgColor = (cellId) => {
        if (cellId === hoveredCell) {
            return 'cell-bg-primarygrid-default-hover cursor-pointer';
        } else return 'cell-bg-primarygrid-default cursor-pointer';
    }

    const cellHoverAction = (cellId) => {
        setHoveredCell(cellId);
    }

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < CONSTANT_PROPS.GRID_SIZE; i++) {
            const row = [];
            for (let j = 0; j < CONSTANT_PROPS.GRID_SIZE; j++) {
                const cellId = String.fromCharCode(65 + i, 65 + j);
                row.push(
                    <td key={cellId} cell-id={cellId} className={`cell p-4 fw-lighter ${selectGridCellBgColor(cellId)}`}
                        onMouseOver={() => cellHoverAction(cellId)} onClick={() => sendGameMove(cellId)} 
                        style={{ maxWidth: '10%', maxHeight: '10%' }}>{cellId}</td>
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
            <h5 className="fw-bold">Opponent's battlefield</h5>
            <div className="fw-light">It has the ships placed by the opponent</div>
            <div className="row mt-3 mb-1">
                <div className="col-6 mx-auto">
                    <table onMouseOut={() => setHoveredCell(null)} className="table table-bordered table-info">
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

export default PrimaryPlayerGrid;