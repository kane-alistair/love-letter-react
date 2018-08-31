import React, { Component } from 'react';

class Game extends Component {
  state = {
    players: null
  }

  componentDidMount() {
    fetch(`http://localhost:8080/game/players/`, {
      mode: 'cors'
    })
    .then(res => res.json())
    .then(res => this.setState({players: res}));
  }

  render() {
    return (
      <div>Game</div>
    );
  }

}

export default Game;
