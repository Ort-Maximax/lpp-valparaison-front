/* global window */
import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Home from '../Home/Home';
import Topbar from '../Topbar/Topbar';
import Pricings from '../Pricings/Pricings';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import Login from '../Login/Login';
/* import Signup from '../Signup/Signup'; */
import Explorer from '../Explorer/Explorer';

import './styles/App.css';

function onAuthRequired({ history }) {
  history.push('/login');
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { musicPlaylist: [], audioPlayer: false };
    // this.apiUrl = 'https://valparaiso-mockup.herokuapp.com'; // Pour netlify
    // this.apiUrl = 'http://valparaiso.fr:3009'; // Pour dev
    this.apiUrl = 'http://api.valparaiso.fr'; // Pour la prod
    this.onPlaylistChange = this.onPlaylistChange.bind(this);
  }

  onPlaylistChange = (sound) => {
    this.setState({ musicPlaylist: [sound] });
  }

  onToggleAudioPlayer = () => {
    this.setState({ audioPlayer: !this.state.audioPlayer });
  }

  render() {
    return (
      <Fragment>
        <Router>
          <Security
            issuer="https://dev-438691.oktapreview.com/oauth2/default"
            client_id="0oaee9k1e3g9di0nS0h7"
            redirect_uri={`${window.location.origin}/implicit/callback`}
            onAuthRequired={onAuthRequired}
          >
            <Route path="/" component={Topbar} />
            <Route path="/" exact component={Home} />
            <Route path="/pricing" exact component={Pricings} />
            <SecureRoute path="/browse" exact render={() => <Explorer audioPlayer={this.state.audioPlayer} onPlaylistChange={this.onPlaylistChange} apiUrl={this.apiUrl} />} />
            <Route path="/login" exact render={() => <Login baseUrl="https://dev-438691.oktapreview.com" />} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
            <Route
              path="/"
              render={() => (<AudioPlayer
                toggleAudioPlayer={this.onToggleAudioPlayer}
                playerCollapsed={this.state.audioPlayer}
                playlist={this.state.musicPlaylist}
              />)}
            />
          </Security>
        </Router>
      </Fragment>

    );
  }
}

export default App;
