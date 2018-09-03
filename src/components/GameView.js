import React, { Component } from 'react';
import RequestHelper from '../helpers/RequestHelper';

class GameView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: props.newPlayer
    }
  }

  componentDidMount() {

  }

  render() {
    if (this.state.player == null) return;
    return (
      <div>Welcome {this.state.player.name}</div>
    );
  }

}

export default GameView;
