import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import './index.css';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs'
import registerServiceWorker from './registerServiceWorker';
import PlayerCreator from './components/PlayerCreator';
import GameView from './components/GameView';

ReactDOM.render(<PlayerCreator/>, document.getElementById('root'));
registerServiceWorker();
