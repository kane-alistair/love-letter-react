import React, { Component } from 'react';
import RequestHelper from '../helpers/RequestHelper'
import { Redirect } from 'react-router-dom';

class GameView extends Component{
  state = {
    game: null,
    roundNumber: 0
  }

  componentDidMount() {
    const helper = new RequestHelper();
    helper.getGame().then(res => this.setState({ game: res }))
  }

  getUser(userId){
    let foundPlayer = null;
    for (let player of this.state.game.players){
      if (userId === player.externalId){
        foundPlayer = player;
      }
    }
    return foundPlayer;
  }

  render(){
    if (this.state.game === null) return null;
    const userId = parseInt(localStorage.getItem('storedId'), 0);
    const user = this.getUser(userId);
    if (user === null) return <Redirect to="/new-player"/>

    const handleNewRoundBtn = () => {
      const helper = new RequestHelper();
      const newRoundNumber = this.state.roundNumber + 1;
      helper.startRound().then(res => this.setState({
        roundNumber: newRoundNumber,
        game: res
      }))
    }

    let roundStartBtn;
    if (this.state.game.roundOver === true){
      roundStartBtn = (<button onClick={handleNewRoundBtn}>Start Round</button>)
    }

    const allPlayersList = this.state.game.players.map(player => {
      let activeSymbol = null;
      if (player.activeTurn === true) activeSymbol = "*TURN*"
      return (<li key={player.externalId}>{player.name}{activeSymbol}</li>)
    })

    return (
      <div>
        <h1>Welcome {user.name}</h1>
        <p>You are holding a {user.hand[0]} and a {user.hand[1]}</p>
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
