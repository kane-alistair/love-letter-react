import React, { Component } from 'react';
import RequestHelper from '../helpers/RequestHelper'
import { Redirect } from 'react-router-dom';

class GameView extends Component{
  state = {
    game: null,
    roundNumber: 0,
    user: null
  }

  componentDidMount() {
    const helper = new RequestHelper();
    const userId = parseInt(localStorage.getItem('storedId'), 0);
    helper.getGame().then(res => {
      this.setState({
        game: res,
        user: this.createUserState(userId, res)
      })
    })
  }

  createUserState(userId, game){
    console.log('cus', game);
    for (let player of game.players){
      if (userId === player.externalId){
        return player
      }
    }
    return null
  }

  render(){
    if (this.state.game === null) return null;
    console.log('render game', this.state);
    if (this.state.user === null) return <Redirect to="/new-player"/>

    const handleNewRoundBtn = () => {
      const helper = new RequestHelper();
      const newRoundNumber = this.state.roundNumber + 1;
      helper.startRound().then(res => this.setState({
        roundNumber: newRoundNumber,
        game: res
      }))
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
