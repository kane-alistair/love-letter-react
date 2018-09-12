import React from 'react';

const UserActionPanel = ({ selectPlayer, isActiveTurn, isMakeGuess, hand, turnBtnHandler, guessBtnHandler, guessInputOnChange, selectPlayerHandler, players}) => {
  if (isMakeGuess){
    const input = (<input onChange={guessInputOnChange} type="number" max="8"/>)
    const submitBtn = (<button onClick= {() => guessBtnHandler(input)}>Submit</button>)
    return(
      <div>
        <p>Make a guess..</p>
        {input}
        {submitBtn}
      </div>
    )
  }

  if (selectPlayer) {
    const selectablePlayers = players.map(player => {
      if (player.attackable) return (<li onClick={selectPlayerHandler}>{player.name}</li>)
      return null;
    })

    return(
      <div>
        <p>Select a player:</p>
        <ul>
          {selectablePlayers}
        </ul>
      </div>
    )
  }

  let keyNumber = 1;
  if (isActiveTurn){
    const hands = hand.map(card => {
      keyNumber++;
      if (card) return (<button onClick={turnBtnHandler} value={card} key={keyNumber}>Play {card}</button>)
      return null;
    })

    return (
      <div>
        {hands}
      </div>
    )
  }

  return null;
};

export default UserActionPanel;
