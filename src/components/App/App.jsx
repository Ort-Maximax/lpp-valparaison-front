import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from '../Home/Home';
import Topbar from '../Topbar/Topbar';
import Pricings from '../Pricings/Pricings';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import Login from '../Login/Login';
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

    this.onPlaylistChange = this.onPlaylistChange.bind(this);
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
    // TODO: Clear le token du localstorage
  };

  render() {
    console.log(`API Url : ${this.apiUrl}`);
    return (
      <Router>
        <Fragment>
          <Route path="/" render={() => (<Topbar isAuthenticated={this.state.isAuthenticated} />)} />
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
          <Route
            path="/login"
            exact
            render={() =>
                (<Login
                  authenticate={this.authenticate}
                  logout={this.logout}
                  apiUrl={this.apiUrl}
                />)}
          />
          <Route
            path="/"
            render={() =>
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
