import React from 'react';
import PropTypes from 'prop-types';

const DeckDisplay = ({ roundOver, deckCount, hand }) => {
  if (roundOver) return null;

  let handDisplay;
  if (hand) handDisplay = hand.map(card => (<p key={card}>{card}</p>))
  return(
    <div>
      <p>Cards Remaining: {deckCount}</p>
      {handDisplay}
    </div>
  )};

  DeckDisplay.propTypes = {
    roundOver: PropTypes.boolean,
    deckCount: PropTypes.integer,
    hand: PropTypes.array.isRequired
  }


  export default DeckDisplay;
