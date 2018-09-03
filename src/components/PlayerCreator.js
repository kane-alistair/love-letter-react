import React, { Component } from 'react';
import GameView from './GameView';
import './PlayerCreator.css';

class PlayerCreator extends Component {
  state = {
    name: null,
    allPlayers: null,
    newPlayer: null
  }

  componentDidMount() {
    fetch(`http://localhost:8080/game/players/`, {
      method: 'GET',
      mode: 'cors'
    })
    .then(res => res.json())
    .then(res => this.setState({allPlayers: res}));

    const storedPlayer = localStorage.getItem('storedPlayer');
    this.setState({ newPlayer: JSON.parse(storedPlayer) });
  }

  render(){
    if (this.state.newPlayer !== null) return (<GameView newPlayer={this.state.newPlayer}/>)
    if (this.state.allPlayers == null) return "Server down! Come back later";
    return this.renderCreateNewPlayerForm();
  }

  renderCreateNewPlayerForm() {
    const handleNameChange = e => {
      this.setState({name: e.target.value})
    }

    const handleLinkClick = e => {
      e.preventDefault()
      fetch('http://localhost:8080/game/players/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: `${this.state.name}`,
        })
      }
    )
    .then(res => res.json())
    .then(res => {
      this.setState({ newPlayer: res })
      localStorage.setItem('storedPlayer', JSON.stringify(res))
    })


  }

  const currentlyPlaying = this.state.allPlayers.map(player => {
    return (<li key={player.externalId}>{player.name}</li>)
  })

  return(
    <div>
      <h1>Enter your name</h1>
      <input id="name-input" type="text" name="name" onChange={handleNameChange}/>
      <a href="/newPlayer" onClick={handleLinkClick}>Start Game</a>
      <div id="currently-playing-container">
        <p>Currently Playing...</p>
        <ul>
          {currentlyPlaying}
        </ul>
      </div>
    </div>
  )
}
};

export default PlayerCreator;
