import React from 'react';
import Home from '@material-ui/icons/Home';
import Grid from 'material-ui/Grid';
import './styles/Crumb.css';

const Crumb = props => (
  <div
    className={`crumb ${props.selected ? 'selected' : ''}`}
    onClick={() => props.onCursorChange(props.cursor)}
    role="button"
  >
    <Grid
      style={{ margin: 0 }}
      container
      direction="row"
    >
      {props.cursor.root &&

      <Home />

    }
      <div>
        {props.cursor.name}
      </div>
    </Grid>

  </div>
);

export default(Crumb);
