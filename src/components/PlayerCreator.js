import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './PlayerCreator.css';

class PlayerCreator extends Component {
  state = {
    name: null,
    allPlayers: null,
    newPlayers: []
  }

  componentDidMount() {
    console.log('cdm');
    fetch(`http://localhost:8080/game/players/`, {
      method: 'GET',
      mode: 'cors'
    })
    .then(res => res.json())
    .then(res => this.setState({allPlayers: res}));
  }

  render(){
    if (this.state.allPlayers == null) return null;

    const currentlyPlaying = this.state.allPlayers.map(player => {
      return (<li key={player.externalId}>{player.name}</li>)
    })
    console.log('render CurrentlyPlaying', currentlyPlaying);

    const handleNameChange = e => {
      this.setState({name: e.target.value})
    }

    const handleLinkClick = e => {
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
      const newState = this.state.newPlayers;
      newState.push(res);
      this.setState({newPlayers: newState})
    })
  }

  return(
    <div>
      <h1>Enter your name</h1>
      <input id="name-input" type="text" name="name" onChange={handleNameChange}/>
      <Link to="/game" onClick={handleLinkClick}>Start Game</Link>
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
