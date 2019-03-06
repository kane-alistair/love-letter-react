import React from 'react';

const PlayersList = ({ players }) => {
  const playerListItems = players.map(player => {
    let activeSymbol, protectedStatus = null;
    if (player.activeTurn) activeSymbol = "*"
    if (!player.attackable) protectedStatus = "-p"
    return (<li key={player.externalId} className="player-li">{player.name}{activeSymbol}{protectedStatus}</li>)
  })

  return (
    <ul className="currently-playing-container">
    {playerListItems}
    </ul>
  )
};

export default PlayersList;
