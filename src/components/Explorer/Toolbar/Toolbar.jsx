import React from 'react';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import Search from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SelectAll from '@material-ui/icons/SelectAll';

import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import './styles/Toolbar.css';


class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { SearchBar: false };
  }
  toggleSearchbar() {
    this.setState({ SearchBar: !this.state.SearchBar });
  }
  render() {
    return (
      <Grid
        container
        direction="row"
      >
        <Paper className="toolbar-container">
          <Grid
            style={{ margin: 0, width: '100%' }}
            container
            direction="row"
          >
            <Grid item style={{ width: 'calc(100% - 160px)', padding: 0 }}>
              <Breadcrumbs
                onCursorChange={this.props.onCursorChange}
                cursor={this.props.cursor}
              />
            </Grid>

            <Grid item style={{ width: 160 }} container direction="row" justify="flex-end" alignItems="center">
              <IconButton className="toolbar-button" onClick={() => this.toggleSearchbar()}>
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

        <section className="searchbar-container"style={{ maxHeight: this.state.SearchBar ? 25 : 0 }}>
          SEARCHBAR
        </section>


      </Grid>
    );
  }
}

export default (Toolbar);
