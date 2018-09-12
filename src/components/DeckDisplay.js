import React from 'react';

const DeckDisplay = ({ roundOver, deckCount, hand }) => {
  if (roundOver) return null;

  let handDisplay;
  if (hand) handDisplay = hand.map(card => (<p key={card}>{card}</p>))
  return(<div>
    <p>Cards Remaining: {deckCount}</p>
    {handDisplay}
  </div>)
};

export default DeckDisplay;
