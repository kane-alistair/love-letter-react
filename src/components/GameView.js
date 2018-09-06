import React from 'react';
import RequestHelper from '../helpers/RequestHelper'

const GameView = ({game, playerId}) => {
  const helper = new RequestHelper();
  let user, roundStartBtn;
  console.log('gv game', game);
  for (let player of game.players){
    console.log('in loop player', player);
    if (player.externalId === playerId){
      user = player;
      break;
    }
  }

  console.log('foundUser', user);

  const handleNewRound = () => {
    helper.startRound();
  }

  if (game.roundOver === true){
    roundStartBtn = (<button onClick={handleNewRound}>Start Round</button>)
  }

  const allPlayersList = game.players.map(player => {
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

export default GameView;
