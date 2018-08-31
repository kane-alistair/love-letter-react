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
    console.log(this.state.players);
    return (
      <div>Test</div>
    );
  }

}

export default Game;
