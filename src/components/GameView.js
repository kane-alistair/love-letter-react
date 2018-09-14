import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Stomp from 'stompjs'
import SockJS from 'sockjs-client';
import PlayersList from './PlayersList';
import UserDisplay from './UserDisplay';
import UserActionPanel from './UserActionPanel';
import DeckDisplay from './DeckDisplay';

class GameView extends Component{
  constructor(props){
    super(props);
    let stompClient;
    var sock = new SockJS('http://localhost:8080/game');
    stompClient = Stomp.over(sock);

    this.state = {
      game: null,
      guess: 0,
      user: null,
      playerCount: 0,
      playerId: 0,
      activePlayer: null,
      selectPlayer: false,
      selectedPlayerId: null,
      makeGuess: false,
      cardToPlay: 0,
      action: stompClient
    }
  }

  componentDidMount() {
    const storedId = parseInt(localStorage.getItem('storedId'), 0)
    this.setState({ playerId: storedId })
    console.log('cdm', storedId);
    this.state.action.connect({}, (frame) => {
      console.log('connected to', frame);
      this.state.action.subscribe('/topic/game', (res) => {
        let gameState = JSON.parse(res.body)
        this.setState({
          game: gameState,
          user: this.findPlayer(storedId, gameState),
          playerCount: gameState.players.length,
          activePlayer: this.getActivePlayer(gameState)
        })
      })
      //updates player count so start round button shows for all players
      this.state.action.send('/app/game-state')
    })
  }
  
  componentWillUnmount() {
    window.addEventListener("beforeunload", () => {
      let userId = null;
      if (this.state.user){
        userId = this.state.user.externalId
      }
      console.log('removing player', userId);
      this.state.action.send('/app/remove-player', {}, userId)
    })
  }

  getActivePlayer = game => {
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
    const selectedPlayerId = parseInt(e.target.value, 0);

    if (this.state.cardToPlay === 1){
      this.setState({
        selectedPlayerId: selectedPlayerId,
        makeGuess: true,
        selectPlayer: false
      })
    } else {
      this.setState({ selectPlayer: false })
      this.sendTurn(this.state.user.externalId, this.state.cardToPlay, 0, selectedPlayerId)
    }
  }

  handleTurnBtnClick = (e) => {
    // when player clicks button, assesses whether they need to then select a player or not
    e.preventDefault();
    const cardToPlay = parseInt(e.target.value, 0)
    if (cardToPlay === 1 || cardToPlay === 2 || cardToPlay === 3 || cardToPlay === 5 || cardToPlay === 6){
      this.setState({
        selectPlayer: true,
        cardToPlay: cardToPlay
      })
    } else {
      this.sendTurn(this.state.user.externalId, cardToPlay, 0, this.state.user.externalId)
    }
  }

  handleGuessBtn = () => {
    let { user, cardToPlay, selectedPlayerId } = this.state;
    this.setState({
      makeGuess: false,
      selectPlayer: false
    })

    this.sendTurn(user.externalId, cardToPlay, this.state.guess, selectedPlayerId)
  }

  guessInputOnChange = (e) => {
    const guess = parseInt(e.target.value, 0)
    this.setState({ guess: guess })
  }

  handleNewRoundBtn = () => {
    this.state.action.send('/app/new-round', {}, "new round")
  }

  roundStartBtn = () => {
    if (this.state.game.roundOver === true && this.state.playerCount >= 2){
      return (<button onClick={this.handleNewRoundBtn}>Start Round</button>)
    } else if (this.state.playerCount < 2){
      return (<p>Waiting for more players... </p>)
    }
  }

  render(){
    console.log('renderUser', this.state.user);
    if (this.state.game === null) return null;
    if (this.state.user === null) return <Redirect to="/new-player"/>
    let deckDisplay;

    if (this.state.user.deckCount) deckDisplay = (
      <div>
      <DeckDisplay
        hand={this.state.user.hand}
        deckCount={this.state.game.deck.numberOfCards}
        roundOver={this.state.game.roundOver}/>
      </div>
      )

    return (
      <div>
        <div>
          <UserDisplay name={this.state.user.name} numberOfRounds={this.state.game.numberOfRounds} />
        </div>

        <div>
          <UserActionPanel
            hand={this.state.user.hand}
            selectPlayer={this.state.selectPlayer}
            isActiveTurn={this.state.user.activeTurn}
            isMakeGuess={this.state.makeGuess}
            players={this.state.game.players}
            turnBtnHandler={this.handleTurnBtnClick}
            guessBtnHandler={this.handleGuessBtn}
            guessInputOnChange={this.guessInputOnChange}
            selectPlayerHandler= {this.handleClickSelected}
            roundOver={this.state.game.roundOver}
            roundNumber={this.state.game.numberOfRounds}
            newRoundBtnHandler={this.handleNewRoundBtn}
          />
          {deckDisplay}
          <p>In game:</p>
          <ul>
            <PlayersList players={this.state.game.players} roundOver={this.state.game.roundOver}/>
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
