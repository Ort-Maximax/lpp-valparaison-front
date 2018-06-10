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
      alignItems="center"
    >
      {props.cursor.root ?
      (<Home style={{ display: 'flex' }} />)
      :
      (props.cursor.name)
      }
    </Grid>
  </div>
);

export default(Crumb);
