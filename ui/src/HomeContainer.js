import GameChat from './GameChat';
import GamePlay from './GamePlay';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function HomeContainer(){
    return(
        <div style={{ height: '100vh' }}>
            <Header />
            <br />
            <Body />
        </div>
    )
}

function Header(){
    return(
        <div>
            <h2>BattleShip</h2>
            <h6>You can play the classic game of BattleShip here while chatting along with your friends!</h6>
        </div>
    )
}

function Body(){
    return(
        <Container fluid>
            <Row style={{ height: '100vh' }}>
                <Col className='gameplay-bg col-8'>
                    <GamePlay/>
                </Col>
                <Col className='gamechat-bg col-4'>
                    <GameChat/>
                </Col>
            </Row>
        </Container>
    )
}

export default HomeContainer;