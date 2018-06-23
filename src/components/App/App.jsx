
/* global window */
import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import decode from 'jwt-decode';

import Home from '../Home/Home';
import Topbar from '../Topbar/Topbar';
import Pricings from '../Pricings/Pricings';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
/* import Login from '../Login/Login'; */
/* import Signup from '../Signup/Signup'; */
import Explorer from '../Explorer/Explorer';
import PrivateRoute from '../PrivateRoute/PrivateRoute';

import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      musicPlaylist: [],
      audioPlayer: false,
    };
    // this.apiUrl = 'https://valparaiso-mockup.herokuapp.com'; // Pour netlify
    this.apiUrl = 'http://valparaiso.fr:3009'; // Pour dev
    // this.apiUrl = 'https://api.valparaiso.fr'; // Pour la prod
  }

  componentWillMount = () => {
    const auth = JSON.parse(window.localStorage.getItem('auth'));
    if (auth) {
      const decoded = decode(auth.token);
      if (decoded.exp) {
        console.log(decoded);
        // TODO: Recup l'heure du serveur, si l'expiration est passé, auth = false
        if (true) {
          this.authenticate();
        }
      }
    }
  }

  onPlaylistChange = (sound) => {
    this.setState({ musicPlaylist: [sound] });
    this.setState({ audioPlayer: true });
  }

  onToggleAudioPlayer = () => {
    this.setState({ audioPlayer: !this.state.audioPlayer });
  }

  authenticate = () => {
    this.setState({ isAuthenticated: true });
  }

  logout = () => {
    this.setState({ isAuthenticated: false });
    window.localStorage.removeItem('auth');
  };

  render() {
    console.log(`API Url : ${this.apiUrl}`);
    return (
      <Router>
        <Fragment>
          <Route
            path="/"
            component={() => (<Topbar
              logout={this.logout}
              authenticate={this.authenticate}
              apiUrl={this.apiUrl}
              isAuthenticated={this.state.isAuthenticated}
            />)}
          />
          <Route path="/" exact component={Home} />
          <Route path="/pricing" exact component={Pricings} />
          <PrivateRoute
            path="/browse"
            exact
            auth={this.state.isAuthenticated}
            component={() =>
                (<Explorer
                  audioPlayer={this.state.audioPlayer}
                  onPlaylistChange={this.onPlaylistChange}
                  apiUrl={this.apiUrl}
                />)}
          />
          {/*
            <Route
              path="/login"
              exact
              component={() =>
                  (<Login
                    authenticate={this.authenticate}
                    logout={this.logout}
                    apiUrl={this.apiUrl}
                  />)}
            />
          */}

          <Route
            path="/"
            component={() =>
                (<AudioPlayer
                  toggleAudioPlayer={this.onToggleAudioPlayer}
                  playerCollapsed={this.state.audioPlayer}
                  playlist={this.state.musicPlaylist}
                  isAuthenticated={this.state.isAuthenticated}
                />)}
          />
        </Fragment>
      </Router>

    );
  }
}

export default App;
