//all the constant texts
export const MESSAGES = Object.freeze({
    GAME_HEADER: 'Let\'s Play Battleship',
    NO_SHIP_SELECTED: 'Select a Warship before trying to place anything on the Battlefield!',
    ALL_SHIPS_PLACED: 'All Warships placed. Start the game!'
});

//all constant properties
export const CONSTANT_PROPS = Object.freeze({
    GRID_SIZE: 8,
    TOTAL_SHIP_COUNT: 5,
    DEFAULT_SHIP_DIRECTION: 'Horizontal'
});

//all WebSocket related info
export const WS_CONFIG = Object.freeze({
    URL: 'http://localhost:8080/game/battleship/ws',

    //topics to subscribe to via WS
    READ_PATH_CHAT: '/chat/public',
    READ_PATH_GAMEMOVE: '/play/public',

    //path where we send our chat/move via WS
    WRITE_PATH_CHAT: '/action/msg',
    WRITE_PATH_GAMEMOVE: '/action/move'
});

//all Http related info
export const HTTP_CONFIG = Object.freeze({
    URL: 'http://localhost:8080/game/battleship/http',

    //api paths
    PATH_START_GAME: '/startgame'
});

//the initial ship configuration/properties
export const DEFAULT_SHIP_INFO = {
    carrier: {
        shipName: "Carrier",
        bgcolorPlaced: 'cell-bg-placedposition-carrier',
        bgColorHovered: 'cell-bg-validposition-carrier',
        shipPlaced: false,
        cellCount: 5,
        cells: [],
    },
    battleship: {
        shipName: "BattleShip",
        bgcolorPlaced: 'cell-bg-placedposition-battleship',
        bgColorHovered: 'cell-bg-validposition-battleship',
        shipPlaced: false,
        cellCount: 4,
        cells: []
    },
    destroyer: {
        shipName: "Destroyer",
        bgcolorPlaced: 'cell-bg-placedposition-destroyer',
        bgColorHovered: 'cell-bg-validposition-destroyer',
        shipPlaced: false,
        cellCount: 3,
        cells: []
    },
    submarine: {
        shipName: "Submarine",
        bgcolorPlaced: 'cell-bg-placedposition-submarine',
        bgColorHovered: 'cell-bg-validposition-submarine',
        shipPlaced: false,
        cellCount: 3,
        cells: []
    },
    patrolboat: {
        shipName: "Patrol Boat",
        bgcolorPlaced: 'cell-bg-placedposition-patrolboat',
        bgColorHovered: 'cell-bg-validposition-patrolboat',
        shipPlaced: false,
        cellCount: 2,
        cells: []
    }
}