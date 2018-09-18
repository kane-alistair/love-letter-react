import React from 'react';
import PropTypes from 'prop-types';

const UserActionPanel = ({
  selectPlayer, isActiveTurn, isMakeGuess, hand, turnBtnHandler, guessBtnHandler, guessInputOnChange,
  selectPlayerHandler, players, roundOver, roundNumber, newRoundBtnHandler
}) => {
  if (roundOver){
    let roundOverHeader;
    if (roundNumber > 0) roundOverHeader = (<h2>Round Over!</h2>)
    if (players.length > 1){
      return (
        <div>
          {roundOverHeader}
          <button onClick={newRoundBtnHandler}>Start Round</button>
        </div>
      )} else return (<div>Waiting for players...</div>)
    }

    if (isMakeGuess){
      const input = (<input onChange={guessInputOnChange} type="number" max="8" min="2"/>)
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
        if (player.attackable) return (<li value={player.externalId} onClick={selectPlayerHandler}>{player.name}</li>)
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

  UserActionPanel.propTypes = {
    selectPlayer: PropTypes.bool.isRequired,
    isActiveTurn: PropTypes.bool.isRequired,
    isMakeGuess: PropTypes.bool.isRequired,
    hand: PropTypes.array.isRequired,
    turnBtnHandler: PropTypes.func.isRequired,
    guessBtnHandler: PropTypes.func.isRequired,
    guessInputOnChange: PropTypes.func.isRequired,
    selectPlayerHandler: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired,
    roundOver: PropTypes.bool.isRequired,
    roundNumber: PropTypes.number.isRequired,
    newRoundBtnHandler: PropTypes.func.isRequired,
  };

  export default UserActionPanel;
