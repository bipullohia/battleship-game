import { CONSTANT_PROPS } from "../../utils/constants";
import '../../styles/CellBGColors.css'

const SecondaryPlayerGrid = () => {

    const selectGridCellBgColor = (cellId) => {
        return 'cell-bg-secondarygrid-default';
    }

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < CONSTANT_PROPS.GRID_SIZE; i++) {
            const row = [];
            for (let j = 0; j < CONSTANT_PROPS.GRID_SIZE; j++) {
                const cellId = String.fromCharCode(65 + i, 65 + j);
                row.push(
                    <td key={cellId} cell-id={cellId} className={`cell p-4 fw-lighter ${selectGridCellBgColor(cellId)}`}
                        style={{ maxWidth: '10%', maxHeight: '10%' }}></td>
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