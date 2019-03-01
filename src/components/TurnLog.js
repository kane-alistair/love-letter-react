import React from 'react';
import PropTypes from 'prop-types';

const TurnLog = ({ events, players, findPlayerById }) => {
  if (!events) return null;
  if (events.length === 0) return null;

  const typeOfMove = ({ id, selected, card }) => {
    const actor = findPlayerById(id, players);
    const victim = findPlayerById(selected, players);

    if (actor === victim){
      return <p>{actor.name} played a {card}</p>
    } else {
      return <p>{actor.name} played a {card} on {victim.name}</p>
    }
  }

  const moveLog = events.map(event => (
    <div className="event-container">
    {typeOfMove(event)}
    </div>
  ))

  return(
    <div id="turn-log-container">
    {moveLog}
    </div>
  )
};

TurnLog.propTypes = {
  events: PropTypes.array
};

export default TurnLog;
