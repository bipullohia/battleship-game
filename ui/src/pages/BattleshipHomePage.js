import GamePlay from '../components/GamePlay/GameBoard';
import GameChat from '../components/GameChat/GameChat';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BattleshipHomePage = () => {
    return(
        <div style={{ height: '100vh' }}>
            <Body />
        </div>
    )
}

// function Header(){
//     return(
//         <div>
//             <h2>BattleShip</h2>
//             <h6>You can play the classic game of BattleShip here while chatting along with your friends!</h6>
//         </div>
//     )
// }

const Body = () => {
    return(
        <Container fluid>
            <Row style={{ height: '100vh' }}>
                <Col className='gameplay-bg col-9'>
                    <GamePlay/>
                </Col>
                <Col className='gamechat-bg col-3'>
                    <GameChat/>
                </Col>
            </Row>
        </Container>
    )
}

/*Advanced features to think of:
    1. dark mode support
    2. cert on ws connection
    3. gameplay settings - to hide the cellId and placement cells (green badges)
    */
export default BattleshipHomePage;