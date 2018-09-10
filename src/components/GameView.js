import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Stomp from 'stompjs'
import SockJS from 'sockjs-client';

class GameView extends Component{
  constructor(props){
    super(props);
    let stompClient;
    var sock = new SockJS('http://localhost:8080/game');
    stompClient = Stomp.over(sock);

    this.state = {
      game: null,
      roundNumber: 0,
      user: null,
      playerCount: 0,
      activePlayer: null,
      selectPlayer: false,
      selectedPlayerId: null,
      makeGuess: false,
      cardToPlay: 0,
      action: stompClient
    }
  }

  componentDidMount() {
    const userId = parseInt(localStorage.getItem('storedId'), 0);

    this.state.action.connect({}, (frame) => {
      console.log('connected: ' + frame);
      this.state.action.subscribe('/topic/game', (res) => {
        let gameState = JSON.parse(res.body)
        this.setState({
          game: gameState,
          user: this.findPlayer(userId, gameState),
          playerCount: gameState.players.length,
          activePlayer: this.getActivePlayer(gameState)
        })
      })
      this.state.action.send('/app/game-state')
    })
  }

  getActivePlayer(game){
    for (let player of game.players){
      if (player.activeTurn === true) return player;
    }
  }

  findPlayer(userId, game){
    for (let player of game.players){
      if (userId === player.externalId){
        return player
      }
    }
    return null
  }

  render(){
    let roundStartBtn, turnBtn;

    if (this.state.game === null) return null;
    if (this.state.user === null) return <Redirect to="/new-player"/>
    console.log('render state', this.state);

    const handleNewRoundBtn = () => {
      this.state.action.send('/app/new-round', {}, "new round")
      const newRoundNumber = this.state.roundNumber + 1;
      this.setState({roundNumber: newRoundNumber})
    }

    const handleTurnBtnClick = (e) => {
      e.preventDefault();
      console.log('htbtnclick', e.target.value);
      const cardToPlay = parseInt(e.target.value, 0)
      if (cardToPlay === 1 || cardToPlay === 2 || cardToPlay === 3 || cardToPlay === 5 || cardToPlay === 6){
        return this.setState({
          selectPlayer: true,
          cardToPlay: cardToPlay
        })
      } else {
        sendTurn(this.state.user.externalId, cardToPlay, 0, this.state.user.externalId)
      }
    }

    const handleClickSelected = (e) => {
      e.preventDefault();
      console.log('hcs');
      if (this.state.cardToPlay === 1){
        return this.setState({
          selectedPlayerId: e.target.value,
          makeGuess: true
        })
      }

      else this.setState({ selectPlayer: false })
      sendTurn(this.state.user.externalId, this.state.cardToPlay, e.target.value, e.target.value)
    }

    const handleGuessBtn = (e) => {
      e.preventDefault();
      let { user, cardToPlay, selectedPlayerId } = this.state;
      this.setState({makeGuess: false})
      const guess = e.target.value;
      sendTurn(user.externalId, cardToPlay, guess, selectedPlayerId)
    }

    const sendTurn = (id, cardToPlay, guess, selectedId) => {
      const turn = {
        id: id,
        card: cardToPlay,
        guess: guess,
        selected: selectedId
      }

      const jsonTurn = JSON.stringify(turn)
      this.state.action.send('/app/take-turn', {}, jsonTurn)
    }

    if (this.state.game.roundOver === true && this.state.playerCount >= 2){
      roundStartBtn = (<button onClick={handleNewRoundBtn}>Start Round</button>)
    } else if (this.state.playerCount < 2){
      roundStartBtn = (<p>Waiting for more players.. </p>)
    }

    const allPlayersList = this.state.game.players.map(player => {
      if (player === this.state.user) return null;
      let activeSymbol = null;
      if (player.activeTurn === true) activeSymbol = " *"
      if (this.state.selectPlayer) return (
        <li key={player.externalId} onClick={handleClickSelected} value={player.externalId}>{player.name}{activeSymbol} - select a player</li>
      )

      return (<li key={player.externalId}>{player.name}{activeSymbol}</li>)
    })

    if (this.state.user.activeTurn === true){
      turnBtn = (
        <div>
          <h4>Your turn!</h4>
          <button onClick={handleTurnBtnClick} value={this.state.user.hand[0]}>Play {this.state.user.hand[0]}</button>
          <button onClick={handleTurnBtnClick} value={this.state.user.hand[1]}>Play {this.state.user.hand[1]}</button>
        </div>
      )
    } else if (this.state.user.activeTurn) {
      turnBtn =(<div>{this.state.activePlayer.name}'s turn</div>)
    }

    let selectAPlayer = null;
    if (this.state.selectPlayer) {
      selectAPlayer = (<p>Select a Player</p>)
    }

    let makeAGuess = null;
    if (this.state.makeGuess) {
      makeAGuess =
      (
        <form>
          <p>Make a guess..</p>
          <input type="number" max="8"/>
          <button onClick={handleGuessBtn}>Guess</button>
        </form>
      )
    }

    let hand1, hand2 = null;
    if (this.state.game.roundOver == false){
      if (this.state.user.hand[0] != null) hand1 = (`Holding: ${this.state.user.hand[0]}`)
      if (this.state.user.hand[1] != null) hand2 = (`Holding: ${this.state.user.hand[1]}`)
    }

    return (
      <div>
        <h1>Welcome {this.state.user.name}</h1>
        <div>{hand1}{hand2}</div>
        {roundStartBtn}
        <p>Opponents:</p>
        <ul>
          {allPlayersList}
        </ul>
        {turnBtn}
        {selectAPlayer}
        {makeAGuess}
      </div>
    )
  }
}

export default GameView;
