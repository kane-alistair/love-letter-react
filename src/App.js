import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import GameView from './components/GameView';
import PlayerCreator from './components/PlayerCreator';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs'
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    let stompClient;
    var sock = new SockJS('http://localhost:8080/game');
    stompClient = Stomp.over(sock);

    this.state = {
      stompClient: stompClient,
      connected: null,
      game: null
    }
  }

  componentDidMount() {
    let { stompClient } = this.state;

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/game', (res) => {
        let gameState = JSON.parse(res.body);
        this.setState({
          game: gameState
        })
      })

      if (stompClient.connected === true)  {
        stompClient.send('/app/game-state')
      } else {
        this.setState({ connected: false })
      }
    })
  }

  render() {
    let { stompClient, game, connected } = this.state;

    if (stompClient.connected === false) return null;
    if (connected === false) return "Server down.";

    const playerCreator = () => <PlayerCreator stompClient={stompClient} game={game}/>
    const gameView = () =>  <GameView stompClient={stompClient} game={game}/>
    const readyStatus = () => <Link to="/new-player">Get Started</Link>

    return (
      <div className="App">
        <Router>
          <main>
            <Route exact path="/new-player" render={playerCreator}/>
            <Route exact path="/play" render={gameView}/>
            <Route exact path="/" render={readyStatus}/>
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
