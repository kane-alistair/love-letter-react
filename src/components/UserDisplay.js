import React from 'react';

const UserDisplay = ({ hand, name, deckCount }) => {
  let deckDisplay, handDisplay;

  if (deckCount) deckDisplay = (`Cards remaining: ${deckCount}`);
  if (hand) handDisplay = hand.map(card => (<p>{card}</p>))

  return(
    <div>
      <h1>{name}</h1>
      <div>
        {handDisplay}{deckDisplay}
      </div>
    </div>
  )
};

export default UserDisplay;
