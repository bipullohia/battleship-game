import { CONSTANT_PROPS } from "../../utils/constants";

const Grid = ({ gridProps }) => {
    const { shipInfo, shipDirection, selectedShip, selectedCells, placedCells, placedShipCount,
            setSelectedShip, setShipInfo, setSelectedCells, setPlacedCells, setPlacedShipCount
     } = gridProps;


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
        for (let i = 0; i < cellCount && y + i < CONSTANT_PROPS.GRID_SIZE; i++) {
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
        for (let i = 0; i < cellCount && x + i < CONSTANT_PROPS.GRID_SIZE; i++) {
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

    const cellClickAction = (cellId) => {
        //if the cell already has a ship, don't do anything (or show up a modal/warning???)
        if (!placedCells.includes(cellId)) {
            //process the selected cells for the selected ship
            if (!selectedShip) {
                if (placedShipCount === CONSTANT_PROPS.TOTAL_SHIP_COUNT) {
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
        for (let i = 0; i < CONSTANT_PROPS.GRID_SIZE; i++) {
            const row = [];
            for (let j = 0; j < CONSTANT_PROPS.GRID_SIZE; j++) {
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

    return (
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
    );
}

export default Grid;