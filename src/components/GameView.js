import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Stomp from 'stompjs'
import SockJS from 'sockjs-client';
import PlayersList from './PlayersList';
import UserDisplay from './UserDisplay';
import UserActionPanel from './UserActionPanel';

class GameView extends Component{
  constructor(props){
    super(props);
    let stompClient;
    var sock = new SockJS('http://localhost:8080/game');
    stompClient = Stomp.over(sock);

    this.state = {
      game: null,
      roundNumber: 0,
      guess: 0,
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

  findPlayer = (userId, game) => {
    for (let player of game.players){
      if (userId === player.externalId){
        return player
      }
    }
    return null
  }

  handleClickSelected = (e) => {
    e.preventDefault();
    const selectedPlayerId = e.target.value
    if (this.state.cardToPlay === 1){
      return this.setState({
        selectedPlayerId: selectedPlayerId,
        makeGuess: true,
        selectPlayer: false
      })
    } else {
      this.setState({ selectPlayer: false })
      this.sendTurn(this.state.user.externalId, this.state.cardToPlay, selectedPlayerId, e.target.value)
    }
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

  handleGuessBtn = (e) => {
    let { user, cardToPlay, selectedPlayerId } = this.state;
    this.setState({ makeGuess: false })

    console.log('submit guess', this.state.guess);
    this.sendTurn(user.externalId, cardToPlay, this.state.guess, selectedPlayerId)
  }

  guessInputOnChange = (e) => {
    this.setState({ guess: e.target.value })
  }

  handleNewRoundBtn = () => {
    this.state.action.send('/app/new-round', {}, "new round")
    const newRoundNumber = this.state.roundNumber + 1;
    this.setState({ roundNumber: newRoundNumber })
  }

  checkRoundOver = () => {
    if (this.state.game.roundNumber >= 1 && this.state.game.roundOver === true){
      return (
        <div>
          <h2>Game Over!</h2>
          <p> Winner is {this.state.game.prevRoundWinner}</p>
        </div>
      )
    }
  }

  roundStartBtn = () => {
    if (this.state.game.roundOver === true && this.state.playerCount >= 2){
      return (<button onClick={this.handleNewRoundBtn}>Start Round</button>)
    } else if (this.state.playerCount < 2){
      return (<p>Waiting for more players... </p>)
    }
  }

  render(){
    console.log('render game', this.state.game);
    console.log('render state', this.state);
    if (this.state.game === null) return null;
    if (this.state.user === null) return <Redirect to="/new-player"/>
    this.checkRoundOver();
    return (
      <div>
        {this.checkRoundOver()}
        <div>
          <UserDisplay hand={this.state.user.hand} name={this.state.user.name} deckCount={this.state.game.deck.numberOfCards}/>
        </div>

        <div>
          <UserActionPanel
            selectPlayer={this.state.selectPlayer}
            isActiveTurn={this.state.user.activeTurn}
            isMakeGuess={this.state.makeGuess}
            players={this.state.game.players}
            hand={this.state.user.hand}
            turnBtnHandler={this.handleTurnBtnClick}
            guessBtnHandler={this.handleGuessBtn}
            guessInputOnChange={this.guessInputOnChange}
            selectPlayerHandler= {this.handleClickSelected}
          />
          <p>In game:</p>
          {this.roundStartBtn()}
          <ul>
            <PlayersList players={this.state.game.players}/>
          </ul>
        </div>
      </div>
    )

    // code to show the previous move
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
