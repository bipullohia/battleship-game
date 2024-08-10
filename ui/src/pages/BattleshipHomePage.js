import GameBoard from '../components/GameBoard';
import GameChat from '../components/GameChat';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BattleshipHomePage = () => {
    return (
        <div style={{ height: '100vh' }}>
            {/* potential header <Header/> */}
            <Body />
        </div>
    )
}

const Body = () => {
    return (
        <Container fluid>
            <Row style={{ height: '100vh' }}>
                <Col className='gameplay-bg col-9'>
                    <GameBoard />
                </Col>
                <Col className='gamechat-bg col-3'>
                    <GameChat />
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