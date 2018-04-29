import React from 'react';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Input, { InputAdornment } from 'material-ui/Input';
import Search from '@material-ui/icons/Search';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import './styles/Toolbar.css';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.onFilterMouseUp = this.onFilterMouseUp.bind(this);
  }

  onFilterMouseUp(e) {
    const filter = e.target.value.trim();
    this.props.onFilterChange(filter);
  }
  render() {
    return (
      <Paper className="toolbar-container">
        <Grid
          style={{ margin: 0 }}
          container
          direction="row"
        >
          <Paper
            style={{
              paddingBottom: 2,
              paddingLeft: 5,
              paddingRight: 5,
              marginBottom: 5,
              width: '15%',
            }}
            className="searchBar"
            square
          >
            <Input
              fullWidth
              placeholder="Rechercher"
              onKeyUp={this.onFilterMouseUp}
              endAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </Paper>
          <Breadcrumbs
            onCursorChange={this.props.onCursorChange}
            cursor={this.props.cursor}
          />
        </Grid>
      </Paper>
    );
  }
}

export default (Toolbar);
