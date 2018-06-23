/* global Event */
import React from 'react';
import ReactDOM from 'react-dom';
import Audio from 'react-audioplayer';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import MusicNote from '@material-ui/icons/MusicNote';


import './styles/AudioPlayer.css';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playlist: this.props.playlist };
    this.shouldUpdate = false;
    this.audioComponent = undefined;
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
  }

  togglePlayer = () => {
    this.props.toggleAudioPlayer();
  }
  render() {
    // Only show player if authenticated
    if (!this.props.playlist || this.props.playlist.length <= 0) return null;
    return (
      <Paper className="player-container">
        <Grid container layout="row" alignItems="flex-end" justify="flex-end">
          <IconButton onClick={this.togglePlayer}>
            {
            this.props.playerCollapsed ?
              <KeyboardArrowDown />
              :
              <MusicNote />

            }
          </IconButton>

        </Grid>
        <Audio
          style={{ display: this.props.playerCollapsed ? 'block' : 'none' }}
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

export default AudioPlayer;
