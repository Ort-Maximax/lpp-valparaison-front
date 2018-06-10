/* global Event */
import React from 'react';
import ReactDOM from 'react-dom';
import Audio from 'react-audioplayer';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import MusicNote from '@material-ui/icons/MusicNote';


import { withAuth } from '@okta/okta-react';


import './styles/AudioPlayer.css';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, playlist: this.props.playlist, playerCollapsed: false };
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

  togglePlayer = () => {
    this.setState({ playerCollapsed: !this.state.playerCollapsed });
  }
  render() {
    // Only show player if authenticated
    if (this.state.authenticated !== true || this.props.playlist.length <= 0) return null;
    return (
      <Paper className="player-container">
        <Grid container layout="row" alignItems="flex-end" justify="flex-end">
          <IconButton onClick={this.togglePlayer}>
            {
            this.state.playerCollapsed ?
              <MusicNote />
              :
              <KeyboardArrowDown />

            }
          </IconButton>

        </Grid>
        <Audio
          style={{ display: this.state.playerCollapsed ? 'none' : 'block' }}
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
