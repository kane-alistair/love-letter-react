import React from 'react';
import PropTypes from 'prop-types';

const TurnLog = ({ events }) => {
  if (!events) return null;
  if (events.length === 0) return null;

  return(
    <div>
      {events.map(event => (
        <div className="event-container" key="3">
          <p key="1">{event.turnTaker} played a {event.card} on {event.selectedPlayer}</p>
        </div>
      ))}
    </div>
  )
};

TurnLog.propTypes = {
  events: PropTypes.array
};

export default TurnLog;
