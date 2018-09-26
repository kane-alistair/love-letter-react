import React from 'react';
import PropTypes from 'prop-types';

const PlayerHandDisplay = ({ hand }) => (
  <div>
    {hand.map(cardValue => <p>{cardValue}</p>)}
  </div>
);

PlayerHandDisplay.propTypes = {
  hand: PropTypes.array.isRequired
};

export default PlayerHandDisplay;
