import React from 'react';

const PlayersList = ({ players }) => (
  players.map(player => {
    let activeSymbol, protectedStatus = null;
    if (player.activeTurn === true) activeSymbol = "*"
    if (player.attackable === false) protectedStatus = "-p"
    return (<li key={player.externalId}>{player.name}{activeSymbol}{protectedStatus}</li>)
  })
);

export default PlayersList;
