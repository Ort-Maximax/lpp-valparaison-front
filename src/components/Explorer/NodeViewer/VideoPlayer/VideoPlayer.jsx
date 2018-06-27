import React from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';

import IconButton from 'material-ui/IconButton';
import Close from '@material-ui/icons/Close';

import { Player } from 'video-react';
import 'video-react/dist/video-react.css';

import './styles/VideoPlayer.css';

const VideoPlayer = props => (
  <Dialog
    fullScreen
    open={props.open}
  >
    <IconButton onClick={props.closeDialog}>
      <Close />
    </IconButton>
    <Grid container direction="row" justify="center" style={{ width: '100%', margin: 0 }}>
      <div className="video-player-container">
        <Player
          playsInline
          autoPlay
          src={props.video && props.video.src ? props.video.src : null}
        />
        <h3 className="video-title">
          {props.video && props.video.name ? props.video.name : null}
        </h3>

      </div>
    </Grid>
  </Dialog>
);

VideoPlayer.propTypes = {
  video: PropTypes.object,
  open: PropTypes.bool,
  closeDialog: PropTypes.func.isRequired,
};

VideoPlayer.defaultProps = {
  video: {},
  open: false,
};

export default VideoPlayer;
