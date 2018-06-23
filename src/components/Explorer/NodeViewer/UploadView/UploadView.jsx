import React from 'react';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import IconButton from 'material-ui/IconButton';
import Close from '@material-ui/icons/Close';
import Collapse from '@material-ui/icons/KeyboardArrowDown';
import Expand from '@material-ui/icons/KeyboardArrowUp';
import Done from '@material-ui/icons/Done';

import './styles/UploadView.css';

class UploadView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
  }

  onCloseClick = () => {
    this.props.clearUploadQueue();
    this.props.onClose();
  }

  toggleCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    return (
      <Grid className={!this.props.visible || (this.props.uploadQueue && this.props.uploadQueue.length === 0) || !this.props.uploadQueue ? 'hidden' : ''}>
        <Grid
          container
          direction="row"
          alignContent="center"
          justify="space-between"
          style={{ width: '100%', margin: 0 }}
          className="dl-header"
        >
          <div className="header-text">
            Uploads
          </div>

          <div className="header-icons">
            <IconButton className="button" onClick={this.toggleCollapse}>
              { this.state.collapsed
              ? <Collapse />
              : <Expand />
              }
            </IconButton>
            <IconButton className="button" onClick={this.onCloseClick} >
              <Close />
            </IconButton>
          </div>

        </Grid>
        {
          !this.state.collapsed &&
          <Paper>
              {
                this.props.uploadQueue && this.props.uploadQueue.map(file => (
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    key={file.lastModified}
                    style={{ width: '100%', margin: 0, flexWrap: 'nowrap' }}
                  >
                    <div className="dl-item" >
                      {file.name}
                    </div>
                    { file.uploaded ?
                      <IconButton style={{
                          height: 'auto',
                          color: 'green',
                        }}
                      >
                        <Done />
                      </IconButton>
                      :
                      <div className="loader" />
                    }
                  </Grid>))
              }
          </Paper>
        }

      </Grid>
    );
  }
}

export default UploadView;

