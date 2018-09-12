import React from 'react';

const UserDisplay = ({ name, numberOfRounds }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Rounds Played: {numberOfRounds}</p>
    </div>);
};

export default UserDisplay;
