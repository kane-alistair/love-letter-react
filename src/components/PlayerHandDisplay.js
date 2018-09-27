import React from 'react';
import PropTypes from 'prop-types';
import './PlayerHandDisplay.css';

const PlayerHandDisplay = ({ hand }) => {
  if (hand[0] === null && hand[1] === null) return null;

  return(
    <div id="hand-container">
      {hand.map(cardValue => {
        return (
          <div className="hand-item" key={hand.indexOf(cardValue)}>
            <p key={hand.indexOf(cardValue)}>{cardValue}</p>
          </div>
        )
      })}
    </div>
  )
};

PlayerHandDisplay.propTypes = {
  hand: PropTypes.array.isRequired
};

export default PlayerHandDisplay;
