import React, { Component } from 'react';

class GameView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: props.newPlayer
    }
  }

  render() {
    if (this.state.player == null) return;
    console.log('renderGame', this.state.player);
    return (
      <div>Welcome {this.state.player.name}</div>

    );
  }

}

export default GameView;
