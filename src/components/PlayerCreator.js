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
    fetch(`http://localhost:8080/game/players/`, {
      mode: 'cors'
    })
    .then(res => res.json())
    .then(res => this.setState({allPlayers: res}));
  }

  render(){
    console.log('render allPlayers', this.state.allPlayers);
    console.log('render NewPlayers', this.state.newPlayers);
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
      <Link to="/newPlayer" onClick={handleLinkClick}>Start Game</Link>
    </div>
  )
}

};

export default PlayerCreator;
