import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import RequestHelper from '../helpers/RequestHelper';
import './GameBoard.css';

class PlayerCreator extends Component {
  state = {
    id: null,
    name: null,
    game: null
  }

  componentDidMount() {
    const helper = new RequestHelper();
    helper.getGame().then(res => this.setState({ game: res }));

    let storedId = localStorage.getItem('storedId');
    if (storedId !== null){
      this.setState({ id: JSON.parse(storedId) });
    }
  }

  render(){
    console.log('pc render', this.state);
    if (this.state.id > 0) return (<Redirect to='/play'/>)
    if (this.state.game) return this.renderCreateNewPlayerForm();
    return null;
  }

  renderCreateNewPlayerForm() {
    const handleNameChange = e => {
      this.setState({name: e.target.value})
    }

    const handleLinkClick = e => {
      e.preventDefault()
      const helper = new RequestHelper();

      helper.createNewPlayer(this.state.name)
      .then(res => {
        localStorage.setItem('storedId', JSON.stringify(res))
        this.setState({
          id: res
        })
      })
    }

    const currentlyPlaying = this.state.game.players.map(player => (<li key={player.externalId}>{player.name}</li>))

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
}

export default PlayerCreator;
