import React from 'react';
import PropTypes from 'prop-types';

const UserDisplay = ({ name, numberOfRounds }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Rounds Played: {numberOfRounds}</p>
    </div>);
  };

  UserDisplay.propTypes = {
    name: PropTypes.string.isRequired,
    numberOfRounds: PropTypes.number.isRequired
  };

  export default UserDisplay;
