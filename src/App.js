import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Game from './components/Game';
import PlayerCreator from './components/PlayerCreator';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <main>
            <Route exact path="/newPlayer" component={PlayerCreator}/>
            <Route exact path="/" render={() => (
              <div>
                <h1>Welcome to Love Letter</h1>
                <Link to={"newPlayer"}>Get Started</Link>
              </div>
            )}/>
            <Route exact path="/game" component={Game}/>
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
