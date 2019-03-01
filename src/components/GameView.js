import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import PlayersList from './PlayersList';
import PlayerHandDisplay from './PlayerHandDisplay';
import TurnLog from './TurnLog';
import UserDisplay from './UserDisplay';
import UserActionPanel from './UserActionPanel';
import DeckDisplay from './DeckDisplay';

class GameView extends Component{
  state = {
    guess: 0,
    playerId: null,
    activePlayer: null,
    selectPlayer: false,
    selectedPlayerId: null,
    makeGuess: false,
    cardToPlay: 0,
    redirect: null
  }

  componentDidMount() {
    let { game } = this.props;
    const storedId = parseInt(localStorage.getItem('storedId'), 0)

    this.setupPlayerState(storedId, game.players)
  }

  isPlayerInGame(players, storedId) {
    for (let player of players) {
      if (parseInt(player.externalId, 0) === storedId) return true;
    }
    return false;
  }

  render(){
    let { game } = this.props;

    if (this.state.redirect) return <Redirect to="/"/>

    const storedId = parseInt(localStorage.getItem('storedId'), 0)
    if (!storedId) return <Redirect to="/new-player"/>
    if (!this.isPlayerInGame(game.players, storedId)) return <Redirect to="/new-player"/>

    let { user } = this.props;

    if (!user) return null;
    if (!user) return <Redirect to="/new-player"/>

    let { selectPlayer, makeGuess } = this.state;
    let deckDisplay;

    if (user.deckCount) deckDisplay = (
      <div>
        <DeckDisplay
          hand={user.hand}
          deckCount={game.deck.numberOfCards}
          roundOver={game.roundOver}/>
        </div>
      )

      return (
        <div>
          <UserDisplay name={user.name} numberOfRounds={game.numberOfRounds} />
          <UserActionPanel
            hand={user.hand}
            selectPlayer={selectPlayer}
            isActiveTurn={user.activeTurn}
            isMakeGuess={makeGuess}
            players={game.players}
            turnBtnHandler={this.handleTurnBtnClick}
            guessBtnHandler={this.handleGuessBtn}
            guessInputOnChange={this.guessInputOnChange}
            selectPlayerHandler= {this.handleClickSelected}
            newRoundBtnHandler={this.handleNewRoundBtn}
            roundOver={game.roundOver}
            roundNumber={game.numberOfRounds}/>
          {deckDisplay}
          <p>In game:</p>
          <ul>
            <PlayersList players={game.players} roundOver={game.roundOver}/>
          </ul>
          <div id="#action-panel">
            <PlayerHandDisplay hand={user.hand}/>
            <TurnLog events={this.displayTurnEvents}/>
          </div>
        </div>
      )
    }

    displayTurnEvents = () => {
      
    }

    setupPlayerState = (storedId, players) => {
      let user = null;
      let activePlayer = null;

      for (let player of players){
        if (player.activeTurn === true) activePlayer = player;
        if (player.externalId === storedId) user = player;
        if (activePlayer && user) break;
      }

      this.setState({
        user: user,
        activePlayer: activePlayer
      })
    }

    sendTurn = (id, cardToPlay, guess, selectedId) => {
      const turn = {
        id: id,
        card: cardToPlay,
        guess: guess,
        selected: selectedId
      }

      const jsonTurn = JSON.stringify(turn)
      this.props.stompClient.send('/app/take-turn', {}, jsonTurn)
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
      this.props.stompClient.send('/app/new-round', {}, "new round")
    }

    roundStartBtn = () => {
      if (this.state.game.roundOver === true && this.state.playerCount >= 2){
        return (<button onClick={this.handleNewRoundBtn}>Start Round</button>)
      } else if (this.state.playerCount < 2){
        return (<p>Waiting for more players... </p>)
      }
    }
  }


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

  export default GameView;


  GameView.propTypes = {
    game: PropTypes.object,
    stompClient: PropTypes.object.isRequired,
    user: PropTypes.object
  }
