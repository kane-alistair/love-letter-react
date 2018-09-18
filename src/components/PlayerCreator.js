import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import RequestHelper from '../helpers/RequestHelper';
import PropType from 'prop-types'

class PlayerCreator extends Component {
  state = {
    name: null,
    submitted: null
  }

  componentDidMount() {
    window.addEventListener("beforeunload", () => {
      this.props.stompClient.send('/app/remove-player', {}, this.props.userId)
    })
  }

  render() {
    let { game } = this.props;
    if (!game) return null;
    if (this.state.submitted) return (<Link to="/play">Click here to join game</Link>);
    if (!game.roundOver) return ("Round in progress. Waiting for round to end");
    return this.renderCreateNewPlayerForm(game);
  }

  renderCreateNewPlayerForm(game) {
    let { stompClient } = this.props;

    const handleNameChange = e => {
      this.setState({ name: e.target.value })
    }

    const handleLinkClick = (e) => {
      e.preventDefault()
      const helper = new RequestHelper();
      const playerName = this.state.name;
      helper.createNewPlayer(playerName)
      .then(res => {
        localStorage.setItem('storedId', JSON.parse(res))
        this.props.handleSubmit(res);
      })
      .then(() => stompClient.send('/app/game-state'))
      .then(() => this.setState({ submitted: true }))
    }

    const currentlyPlaying = game.players.map(player => (<li key={player.externalId}>{player.name}</li>))

    return(
      <div>
        <h1>Enter your name</h1>
        <input id="name-input" type="text" name="name" onChange={handleNameChange}/>
        <Link to="/play" onClick={handleLinkClick}>Submit name</Link>
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
  stompClient: PropType.object.isRequired,
  userId: PropType.number,
  handleSubmit: PropType.func
}

export default PlayerCreator;
