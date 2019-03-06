import React, { Component } from 'react';
import RequestHelper from '../helpers/RequestHelper';
import PropType from 'prop-types'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import GameView from './GameView';
import PlayersList from './PlayersList';

class PlayerCreator extends Component {
  constructor(props){
    super(props);
    let stompClient, sock;
    sock = new SockJS('http://localhost:8080/game');
    stompClient = Stomp.over(sock);

    this.state = {
      name: null,
      stompClient: stompClient,
      connected: true,
      game: null,
      user: null,
      userId: null,
      numPlayers: 0,
      submitted: null
    }

    this.toggleSubmitState = this.toggleSubmitState.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.gameView = this.gameView.bind(this);
    this.findPlayerById = this.findPlayerById.bind(this);
  }

  componentDidMount() {
    let { stompClient } = this.state;
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/game', (res) => {
        const gameState = JSON.parse(res.body);
        if (gameState.players.length > this.state.numPlayers) {
          const userFound = this.findPlayerById(this.state.userId, gameState.players)
          this.setState({ user: userFound, submitted: true })
        }

        this.setState({
          game: gameState,
          numPlayers: gameState.players.length
        })
      })

      if (stompClient.connected === true)  {
        stompClient.send('/app/game-state')
      } else {
        this.setState({ connected: false })
      }
    })

    window.addEventListener("beforeunload", () => {
      if (!this.state.userId) return;
      stompClient.send('/app/remove-player', {}, this.state.userId)
    })
  }

  render() {
    let { stompClient, game, userId, name, submitted } = this.state;
    if (!stompClient.connected) return "Server down.";
    if (!game) return null;
    if (submitted) return (this.gameView());

    return this.renderCreateNewPlayerForm(game);
  }

  gameView() {
    return <GameView
    toggleSubmitState={this.toggleSubmitState}
    stompClient={this.state.stompClient}
    game={this.state.game}
    user={this.state.user}
    />
  }

  findPlayerById(id, players) {
    for (let player of players) {
      if (player.externalId === id) return player;
    }
  }

  toggleSubmitState(bool){
    this.setState({ submitted: bool })
  }

  handleLinkClick(e) {
    e.preventDefault()
    let { name, stompClient } = this.state;

    const helper = new RequestHelper();
    helper.createNewPlayer(name)
    .then(userId => this.setState({ userId: userId }, stompClient.send('/app/game-state')))
  }

  renderCreateNewPlayerForm(game) {
    let { stompClient, name } = this.state;

    const handleNameChange = e => {
      this.setState({ name: e.target.value })
    }

    return(
      <div>
      <h1>Enter your name</h1>
      <form onSubmit={this.handleLinkClick}>
      <input id="name-input" type="text" name="name" onChange={handleNameChange} autoFocus required/>
      <button type="submit" id="name-submit-link">Play</button>
      </form>
      <p>Currently Playing...</p>
      <PlayersList players={game.players}/>
      </div>
    )
  }
}

export default PlayerCreator;
