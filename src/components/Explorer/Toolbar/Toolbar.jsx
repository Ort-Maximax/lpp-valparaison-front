import React from 'react';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import Search from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SelectAll from '@material-ui/icons/SelectAll';

import Input from 'material-ui/Input';

import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import './styles/Toolbar.css';


class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = { searchbar: this.props.searchbar, searchQuery: '' };
  }
  handleSearch(event) {
    this.setState({ searchQuery: event.target.value });
    this.props.onSearchQueryChange(event.target.value);
  }
  closeToolbar() {
    this.props.onSearchbarUpdate(false);
    this.setState({ searchQuery: '' });
    this.props.onSearchQueryChange('');
  }

  toggleSearchbar() {
    this.setState({ searchQuery: '' });
    this.props.onSearchQueryChange('');

    this.props.onSearchbarUpdate(!this.state.searchbar);
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

        <section className="searchbar-container"style={{ maxHeight: this.props.searchbar ? 40 : 0 }}>
          <Paper className="searchbar" >
            <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: 0 }}>
              <Grid item xs={10} style={{ padding: 0 }}>
                <Input
                  value={this.state.searchQuery}
                  onChange={this.handleSearch}
                  className="searchbar-input"
                  placeholder="Recherche"
                  disableUnderline
                  fullWidth
                />
              </Grid>
              <Grid
                container
                item
                layout="row"
                justify="center"
                alignItems="flex-end"
                xs={2}
                style={{ padding: 0 }}
              >
                <Search />
              </Grid>
            </Grid>
          </Paper>
        </section>

      </Grid>
    );
  }
}

export default (Toolbar);
