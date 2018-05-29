import React from 'react';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import Divider from 'material-ui/Divider';

import IconButton from 'material-ui/IconButton';
import Close from '@material-ui/icons/Close';
import Collapse from '@material-ui/icons/KeyboardArrowDown';

import './styles/DownloadView.css';

class DownloadView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grid>
        <Grid
          container
          direction="row"
          alignContent="center"
          justify="space-between"
          style={{ width: '100%', margin: 0 }}
          className="dl-header"
        >
          <div className="header-text">
            Header
          </div>

          <div className="header-icons">
            <IconButton className="button collapse" >
              <Collapse />
            </IconButton>
            <IconButton className="button close" >
              <Close />
            </IconButton>
          </div>

        </Grid>
        <Paper>
          <Grid>
            <div className="dl-item">
              Gilot
            </div>
            <Divider />
            <div className="dl-item">
              Gilot
            </div>
            <Divider />
            <div className="dl-item">
              Gilot
            </div>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default DownloadView;

