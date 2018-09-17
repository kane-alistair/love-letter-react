import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import PropType from 'prop-types'

class PlayerCreator extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: null,
      submitted: false
    }
  }

  render() {
    console.log('pc render', this.state);
    let { game } = this.props;
    if (!game) return null;
    const storedId = parseInt(localStorage.getItem('storedId'), 0);
    if (storedId) return (<Redirect to='/play'/>)
    return this.renderCreateNewPlayerForm();
  }

  renderCreateNewPlayerForm() {
    let { game, stompClient } = this.props;

    const handleNameChange = e => {
      this.setState({ name: e.target.value })
    }

    const handleLinkClick = () => {
      const sendableJson = JSON.stringify({ name: `${this.state.name}` })
      stompClient.send('/app/new-player', {}, sendableJson);
    }

    const currentlyPlaying = game.players.map(player => (<li key={player.externalId}>{player.name}</li>))

    return(
      <div>
        <h1>Enter your name</h1>
        <input id="name-input" type="text" name="name" onChange={handleNameChange}/>
        <a href="/play" onClick={handleLinkClick}>Start Game</a>
        <div id="currently-playing-container">
          <p>Currently Playing...</p>
          <ul>
            {currentlyPlaying}
          </ul>
        </div>
      </div>
    )
  }
}

PlayerCreator.propTypes = {
  game: PropType.object,
  stompClient: PropType.object.isRequired
}

export default PlayerCreator;
