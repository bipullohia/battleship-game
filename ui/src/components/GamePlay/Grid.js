import React from "react";

const Grid = ({ rows, cols }) => {

    // const handleGridClick = (e) => {
    //     alert(`you clicked on ${e.value}`);
    // }

    const renderGrid = () => {
        const grid = [];
        for(let i=0; i<rows; i++){
            const row = [];
            for(let j=0; j<cols; j++){
                row.push(
                    <td cell-id={`${i}:${j}`} className="p-4" onClick={() => alert('Hey!!')} style={{maxWidth: '10%', maxHeight: '10%'}}>{`${i}:${j}`}</td>
                );
            }
            grid.push(
                <tr className="">{row}</tr>
            );
        }

        return grid;
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-6 mx-auto">
                    <table className="table table-bordered table-info">
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