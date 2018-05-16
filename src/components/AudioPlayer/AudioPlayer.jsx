/* global Event */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Paper from 'material-ui/Paper';
import Audio from 'react-audioplayer';

import { withAuth } from '@okta/okta-react';


import './styles/AudioPlayer.css';

class AudioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, playlist: this.props.playlist };
    this.shouldUpdate = false;
    this.audioComponent = undefined;
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playlist !== this.state.playlist) {
      this.shouldUpdate = true;
      this.setState({ playlist: nextProps.playlist });
    }
  }

  componentDidUpdate() {
    if (this.audioComponent && this.shouldUpdate) {
      this.shouldUpdate = false;
      ReactDOM.findDOMNode(this.audioComponent).dispatchEvent(new Event('audio-skip-to-next'));
    }
    this.checkAuthentication();
  }


  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }
  render() {
    // Only show player if authenticated
    if (this.state.authenticated !== true || this.props.playlist.length <= 0) return null;
    console.log(this.state);
    return (
      <Paper className="player-container">
        <Audio
          color="#2aa6ea"
          width={300}
          height={100}
          autoPlay
          ref={(audioComponent) => { this.audioComponent = audioComponent; }}
          playlist={this.state.playlist}
        />
      </Paper>
    );
  }
}

export default withAuth(AudioPlayer);
