import React from 'react';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import './styles/Toolbar.css';

const Toolbar = () => (
  <Paper className="toolbar-container">
    <Grid
      style={{ margin: 0 }}
      container
      direction="row"
    >
      <Button> TEST </Button>
      <div className="toolbar-content">
      TESTESTEST
      </div>
    </Grid>
  </Paper>
);

export default (Toolbar);
