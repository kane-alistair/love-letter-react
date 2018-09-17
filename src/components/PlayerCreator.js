import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import PropType from 'prop-types'
import RequestHelper from '../helpers/RequestHelper';

class PlayerCreator extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: null,
      game: props.game,
      submitted: false,
      stompClient: props.stompClient
    }
  }

  render() {
    let { submitted, game } = this.state;

    if (submitted) return (<Redirect to='/play'/>)
    if (game) return this.renderCreateNewPlayerForm();
  }

  renderCreateNewPlayerForm() {
    const handleNameChange = e => {
      this.setState({ name: e.target.value })
    }

    const handleLinkClick = () => {
      const helper = new RequestHelper();

      helper.createNewPlayer(this.state.name)
      .then(res => {
        localStorage.setItem('storedId', JSON.stringify(res))
        this.setState({
          submitted: true
        })
      })
    }

    const currentlyPlaying = this.state.game.players.map(player => (<li key={player.externalId}>{player.name}</li>))

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
  game: PropType.object.isRequired,
  stompClient: PropType.object.isRequired
}
export default PlayerCreator;
