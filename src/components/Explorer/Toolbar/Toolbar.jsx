import React from 'react';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import './styles/Toolbar.css';

const Toolbar = props => (
  <Paper className="toolbar-container">
    <Grid
      style={{ margin: 0 }}
      container
      direction="row"
    >
      <Breadcrumbs
        onCursorChange={props.onCursorChange}
        cursor={props.cursor}
      />
    </Grid>
  </Paper>
);

export default (Toolbar);
