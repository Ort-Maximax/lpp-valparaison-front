import React from 'react';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import IconButton from 'material-ui/IconButton';
import Close from '@material-ui/icons/Close';
import Collapse from '@material-ui/icons/KeyboardArrowDown';
import Expand from '@material-ui/icons/KeyboardArrowUp';
import Done from '@material-ui/icons/Done';

import './styles/DownloadView.css';

class DownloadView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false, hidden: false };
  }

  /* componentWillReceiveProps(nextProps) {
    // TODO: toggle le hidden seulement si de nouveau fichier dans la queue
     console.log(nextProps);

    console.log(this.props, nextProps);
    if (this.props !== nextProps) {
      this.setState({ hidden: false });
    }

    } */

  onCloseClick = () => {
    // TODO: Clear les fichiers uploaded = true
    this.setState({ hidden: true });
  }

  toggleCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    return (
      <Grid className={this.state.hidden || (this.props.uploadQueue && this.props.uploadQueue.length === 0) || !this.props.uploadQueue ? 'hidden' : ''}>
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
                    style={{ width: '100%', margin: 0 }}
                  >
                    <div className="dl-item" >
                      {file.name}
                    </div>
                    { file.uploaded ?
                      <IconButton style={{
                          height: 'auto',
                          color: 'green',
                          position: 'absolute',
                          right: 10,
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

export default DownloadView;

