import React, { Component } from 'react';
import RequestHelper from '../helpers/RequestHelper';
import PropType from 'prop-types'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import GameView from './GameView';

class PlayerCreator extends Component {
  constructor(props){
    super(props);
    let stompClient, sock;
    sock = new SockJS('http://localhost:8080/game');
    stompClient = Stomp.over(sock);

    this.state = {
      name: null,
      submitted: null,
      stompClient: stompClient,
      connected: true,
      game: null,
      userId: null
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.gameView = this.gameView.bind(this);
    this.findPlayerById = this.findPlayerById.bind(this);
  }

  componentDidMount() {
    let { stompClient } = this.state;
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/game', (res) => {
        const gameState = JSON.parse(res.body);
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

    window.addEventListener("beforeunload", () => {
      stompClient.send('/app/remove-player', {}, this.state.userId)
    })
  }

  render() {
    let { stompClient, game, userId, name } = this.state;
    console.log('r', game);

    if (stompClient.connected === false) return "Server down.";
    if (!game) return null;
    if (this.state.submitted && game.players.length > 0) return (this.gameView());

    return this.renderCreateNewPlayerForm(game);
  }

  gameView() {
    return <GameView
    stompClient={this.state.stompClient}
    game={this.state.game}
    userId={this.state.userId}
    findPlayerById={this.findPlayerById}
    />
  }

  findPlayerById(id, players) {
    console.log('oi', id, players);
    for (let player of players) {
      if (player.externalId === id) return player;
    }
  }

  handleSubmit(userId){
    this.setState({
      userId: userId,
    })
  }

  handleLinkClick(e) {
    e.preventDefault()
    let { name, stompClient } = this.state;

    const helper = new RequestHelper();
    helper.createNewPlayer(name)
    .then(res => {
      localStorage.setItem('storedId', JSON.parse(res))
      this.handleSubmit(res);
    })
    .then(() => {
      stompClient.send('/app/game-state');
      setTimeout(this.setState({ submitted: true }), 4000);
    })
  }

  renderCreateNewPlayerForm(game) {
    let { stompClient, name } = this.state;

    const handleNameChange = e => {
      this.setState({ name: e.target.value })
    }

    const currentlyPlaying = game.players.map(player => (<li key={player.externalId}>{player.name}</li>))

    return(
      <div>
      <h1>Enter your name</h1>
      <input id="name-input" type="text" name="name" onChange={handleNameChange} autoFocus/>
      <button onClick={this.handleLinkClick} id="name-submit-link">Submit name</button>
      <div id="currently-playing-container">
      <p>Currently Playing...</p>
      <ul>
      {currentlyPlaying}
      </ul>
      </div>
      </div>
    )
  }
}

export default PlayerCreator;
