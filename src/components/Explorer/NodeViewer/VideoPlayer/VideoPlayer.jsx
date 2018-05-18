import React from 'react';
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
    <Grid container direction="row" justify="center">
      <div className="video-player-container">
        <Player
          playsInline
          autoPlay
          src={props.video && props.video.src ? props.video.src : null}
        />
        {props.video && props.video.name ? props.video.name : null}
      </div>
    </Grid>
  </Dialog>
);

export default VideoPlayer;
