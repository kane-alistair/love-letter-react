import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Stomp from 'stompjs'
import SockJS from 'sockjs-client';
import PlayersList from './PlayersList';

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
      //updates player count so start round button shows for all players
      this.state.action.send('/app/game-state')
    })
  }

  getActivePlayer = (game) => {
    for (let player of game.players){
      if (player.activeTurn === true) return player;
    }
  }

  sendTurn = (id, cardToPlay, guess, selectedId) => {
    const turn = {
      id: id,
      card: cardToPlay,
      guess: guess,
      selected: selectedId
    }

    const jsonTurn = JSON.stringify(turn)
    this.state.action.send('/app/take-turn', {}, jsonTurn)
  }

  handleClickSelected = (e) => {
    e.preventDefault();
    if (this.state.cardToPlay === 1){
      return this.setState({
        selectedPlayerId: e.target.value,
        makeGuess: true
      })
    }

    else this.setState({ selectPlayer: false })
    this.sendTurn(this.state.user.externalId, this.state.cardToPlay, e.target.value, e.target.value)
  }

  findPlayer = (userId, game) => {
    for (let player of game.players){
      if (userId === player.externalId){
        return player
      }
    }
    return null
  }

  handleTurnBtnClick = (e) => {
    // when player clicks button, assesses whether they need to then select a player or not
    e.preventDefault();
    const cardToPlay = parseInt(e.target.value, 0)
    if (cardToPlay === 1 || cardToPlay === 2 || cardToPlay === 3 || cardToPlay === 5 || cardToPlay === 6){
      return this.setState({
        selectPlayer: true,
        cardToPlay: cardToPlay
      })
    } else {
      this.sendTurn(this.state.user.externalId, cardToPlay, 0, this.state.user.externalId)
    }
  }

  handleGuessBtn = (guessValue) => {
    let { user, cardToPlay, selectedPlayerId } = this.state;
    this.setState({
      makeGuess: false
    })

    console.log('guess', guessValue);
    this.sendTurn(user.externalId, cardToPlay, guessValue, selectedPlayerId)
  }

  handleNewRoundBtn = () => {
    this.state.action.send('/app/new-round', {}, "new round")
    const newRoundNumber = this.state.roundNumber + 1;
    this.setState({roundNumber: newRoundNumber})
  }

  checkRoundOver = () => {
    if (this.state.game.roundNumber >= 1 && this.state.game.roundOver === true){
      return (
        <div>
          <h2>Game Over!</h2>
          <p>Winner is {this.state.game.prevRoundWinner}</p>
          <button onClick={this.handleNewRoundBtn}>Start Round</button>
        </div>
      )
    }
  }

  render(){
    console.log('render game', this.state.game);
    console.log('render state', this.state);

    if (this.state.game === null) return null;
    if (this.state.user === null) return <Redirect to="/new-player"/>
    this.checkRoundOver();

    const roundStartBtn = () => {
      if (this.state.game.roundOver === true && this.state.playerCount >= 2){
        return (<button onClick={this.handleNewRoundBtn}>Start Round</button>)
      } else if (this.state.playerCount < 2){
        return (<p>Waiting for more players... </p>)
      }
    }

    let turnBtn;
    if (this.state.user.activeTurn === true){
      turnBtn = (
        <div>
          <h4>Your turn!</h4>
          <button onClick={this.handleTurnBtnClick} value={this.state.user.hand[0]}>Play {this.state.user.hand[0]}</button>
          <button onClick={this.handleTurnBtnClick} value={this.state.user.hand[1]}>Play {this.state.user.hand[1]}</button>
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
    if (this.state.makeGuess === true) {
      const input = (<input type="number" max="8"/>)
      const submitBtn = (<button onClick={this.handleGuessBtn(input.value)}>Submit</button>)

      makeAGuess =
      (
        <form>
          <p>Make a guess..</p>
          {input}
          {submitBtn}
        </form>
      )
    }

    let hand1, hand2 = null;
    if (this.state.game.roundOver === false){
      if (this.state.user.hand[0] != null) hand1 = (`Holding: ${this.state.user.hand[0]}`)
      if (this.state.user.hand[1] != null) hand2 = (`Holding: ${this.state.user.hand[1]}`)
    }

    let deckCount = (<p>Cards remaining: {this.state.game.deck.numberOfCards}</p>);

    return (
      <div>
        <h1>{this.state.user.name}</h1>
        <div>{hand1}{hand2}</div>
        {roundStartBtn()}
        <p>Opponents:</p>
        <ul>
          <PlayersList players={this.state.game.players}/>
        </ul>
        <div>
          {turnBtn}
          {selectAPlayer}
          {makeAGuess}
          {deckCount}
          {/* {showPrevMove} */}
        </div>
      </div>
    )

    // let prevPlayer = null;
    // if (this.state.game.prevMovePlayerIdCard){
    //   prevPlayer = this.findPlayer(Object.keys(this.state.game.prevMovePlayerIdCard)[0], this.state.game)
    // }
    // console.log('prevPlayer', prevPlayer);
    //
    // let prevMove = null;
    // if (this.state.game.prevMovePlayerIdCard){
    //   prevMove = this.state.game.prevMovePlayerIdCard[prevPlayer.externalId]
    // }
    // console.log('prevmove', prevMove);
    //
    // let prevMoveVictim = null;
    // if (this.state.game.prevMoveVictimIdGuess) {
    //   prevMoveVictim = this.findPlayer(Object.keys(this.state.game.prevMoveVictimIdGuess), this.state.game) || null;
    // }
    // console.log('prevMoveVictim', prevMoveVictim);
    //
    // const prevMoveGuess = this.state.game.prevMoveVictimIdGuess || null;
    // console.log('prevMoveVictimGuess', prevMoveGuess);

    // let showPrevMove = null;
    // if (this.state.game.prevPlayer){
    //   showPrevMove = (
    //     <div>
    //       <p>{prevPlayer.name} played a {prevMove} on {prevMoveVictim.name} and guessed a {prevMoveGuess}</p>
    //     </div>
    //   )
    // }

  }
}

export default GameView;
