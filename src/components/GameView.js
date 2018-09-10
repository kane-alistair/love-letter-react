import React, { Component } from 'react';
import RequestHelper from '../helpers/RequestHelper'
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
      action: stompClient
    }
  }

  componentDidMount() {
    console.log('cdm state', this.state);
    const helper = new RequestHelper();
    const userId = parseInt(localStorage.getItem('storedId'), 0);
    helper.getGame().then(res => {
      this.setState({
        game: res,
        user: this.findPlayer(userId, res)
      })
    })

    this.state.action.connect({}, (frame) => {
      console.log('connected: ' + frame);
      this.state.action.subscribe('/topic/game', (response) => {
        let gameState = JSON.parse(response.body)
        this.setState({
          game: gameState,
          user: this.findPlayer(userId, gameState)
        })
      })
    })
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
    if (this.state.game === null) return null;
    if (this.state.user === null) return <Redirect to="/new-player"/>
    console.log('render state', this.state);
    // const handleNewRoundBtn = () => {
    //   const helper = new RequestHelper();
    //   const newRoundNumber = this.state.roundNumber + 1;
    //   helper.startRound().then(res => this.setState({
    //     roundNumber: newRoundNumber,
    //     game: res
    //   }))
    // }

    const handleNewRoundBtn = () => {
      this.state.action.send('/app/new-round', {}, "new round")
      const newRoundNumber = this.state.roundNumber + 1;
      this.setState({roundNumber: newRoundNumber})
    }

    let roundStartBtn;
    if (this.state.game.roundOver === true && this.state.game.players.length >= 2){
      roundStartBtn = (<button onClick={handleNewRoundBtn}>Start Round</button>)
    } else if (this.state.game.players.length < 2){
      roundStartBtn = (<p>Waiting for more players.. </p>)
    }

    const allPlayersList = this.state.game.players.map(player => {
      let activeSymbol = null;
      if (player.activeTurn === true) activeSymbol = "*TURN*"
      return (<li key={player.externalId}>{player.name}{activeSymbol}</li>)
    })

    return (
      <div>
        <h1>Welcome {this.state.user.name}</h1>
        <p>You are holding a {this.state.user.hand[0]} and a {this.state.user.hand[1]}</p>
        {roundStartBtn}
        <p>The players are:</p>
        <ul>
          {allPlayersList}
        </ul>
      </div>
    )
  }
}

export default GameView;
