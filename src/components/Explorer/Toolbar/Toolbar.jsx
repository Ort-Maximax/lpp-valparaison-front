import React from 'react';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import Search from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SelectAll from '@material-ui/icons/SelectAll';

import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import './styles/Toolbar.css';


const Toolbar = props => (
  <Paper className="toolbar-container">
    <Grid
      style={{ margin: 0, width: '100%' }}
      container
      direction="row"
    >
      <Grid item style={{ width: 'calc(100% - 160px)', padding: 0 }}>
        <Breadcrumbs
          onCursorChange={props.onCursorChange}
          cursor={props.cursor}
        />
      </Grid>

      <Grid item style={{ width: 160 }} container direction="row" justify="flex-end" alignItems="center">
        <IconButton className="toolbar-button">
          <Search />
        </IconButton>
        <IconButton className="toolbar-button">
          <SelectAll />
        </IconButton>
        <IconButton className="toolbar-button">
          <MoreVertIcon />
        </IconButton>
      </Grid>

    </Grid>

  </Paper>
);

export default (Toolbar);
