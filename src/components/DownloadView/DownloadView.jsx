import React, { Fragment } from 'react';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import Divider from 'material-ui/Divider';

import IconButton from 'material-ui/IconButton';
import Close from '@material-ui/icons/Close';
import Collapse from '@material-ui/icons/KeyboardArrowDown';
import Expand from '@material-ui/icons/KeyboardArrowUp';

import './styles/DownloadView.css';

class DownloadView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false, hidden: false };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({ hidden: false });
  }

  onCloseClick = () => {
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
            <Grid>
              {
                this.props.uploadQueue && this.props.uploadQueue.map(file => (
                  <Fragment>
                    <div className="dl-item">
                      {file.name}
                    </div>
                    <Divider />
                  </Fragment>))
              }
            </Grid>
          </Paper>
        }

      </Grid>
    );
  }
}

export default DownloadView;

