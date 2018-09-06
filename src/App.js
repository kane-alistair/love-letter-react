import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import GameView from './components/GameView';
import PlayerCreator from './components/PlayerCreator';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <main>
            <Route exact path="/new-player" component={PlayerCreator}/>
            <Route exact path="/play" component={GameView}/>
            <Route exact path="/" render={() => (
              <div>
                <h1>Welcome to Love Letter</h1>
                <Link to={"new-player"}>Get Started</Link>
              </div>
            )}/>
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
