import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

import Search from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SelectAll from '@material-ui/icons/SelectAll';
import CloudDownload from '@material-ui/icons/CloudDownload';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Transform from '@material-ui/icons/Transform';

import Divider from 'material-ui/Divider';

import ClickOutside from 'react-click-outside';
import { MenuItem, MenuList } from 'material-ui/Menu';

import Input from 'material-ui/Input';

import Add from 'img/components/Add';

import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import './styles/Toolbar.css';


class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
  }
  handleSearch = (event) => {
    this.setState({ searchQuery: event.target.value });
    this.props.onSearchQueryChange(event.target.value);
  }
  closeToolbar = () => {
    this.props.onSearchbarUpdate(false);
    this.setState({ searchQuery: undefined });
    this.props.onSearchQueryChange(undefined);
  }

  toggleSearchbar = () => {
    this.setState({ searchQuery: '' });
    this.props.onSearchQueryChange('');

    this.props.onSearchbarUpdate(!this.props.searchbar);
  }

  toggleActionMenu = () => {
    this.setState({
      actionMenuOpen: !this.state.actionMenuOpen,
    });
  };

  closeActionMenu = () => {
    this.setState({
      actionMenuOpen: false,
    });
  }

  handleConvert = () => {
    this.closeActionMenu();
    this.props.handleConvertClick();
  }

  handleDelete = () => {
    this.closeActionMenu();
    this.props.handleDeleteClick();
  }

  handleDownload = () => {
    this.closeActionMenu();
    this.props.handleDownloadClick();
  }


  render() {
    const { actionMenuOpen } = this.state;
    if (this.props.cursor && Object.keys(this.props.cursor).length <= 0) return null;
    return (
      <Fragment>
        <Grid
          container
          direction="row"
        >
          <Paper className="toolbar-container">
            <Grid
              style={{ margin: 0, width: '100%' }}
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item id="breadcrumbs-container" style={{ width: 'calc(100% - 125px)', padding: 0 }}>
                <Breadcrumbs
                  cursor={this.props.cursor}
                  onCursorChange={this.props.onCursorChange}
                />
              </Grid>

              <Grid item style={{ width: 135, paddingLeft: 0 }} container direction="row" justify="flex-end" alignItems="center">
                <IconButton className={`toolbar-button ${this.props.searchbar && 'active'}`} onClick={() => this.toggleSearchbar()}>
                  <Search />
                </IconButton>
                <IconButton className={`toolbar-button ${this.props.toggleSelect && 'active'}`} onClick={this.props.onToggleSelect}>
                  <SelectAll />
                </IconButton>
                <IconButton className="toolbar-button">
                  <ClickOutside
                    onClickOutside={this.closeActionMenu}
                  >
                    <div
                      ref={(node) => {
                        this.actionMenu = node;
                      }}
                    >
                      <MoreVertIcon onClick={this.toggleActionMenu} />

                      <Paper className={actionMenuOpen ? 'action-menu visible' : 'action-menu hidden'}>
                        <MenuList role="menu">
                          {/* TODO: Bind les actions */}
                          <MenuItem onClick={this.props.handleAddClick}>
                            <Add style={{ width: 24, height: 24 }} />
                            <b>Nouveau</b>
                          </MenuItem>

                          <Divider />

                          <MenuItem
                            onClick={this.props.handleNewFolderClick}
                            disabled={this.props.selectedElements.length !== 0}
                          >
                            <div>Nouveau Dossier</div>
                          </MenuItem>

                          <Divider />

                          <MenuItem
                            onClick={this.props.handleRenameClick}
                            disabled={this.props.selectedElements.length !== 1}
                          >
                            <div>Renommer</div>
                          </MenuItem>

                          <Divider />

                          <MenuItem onClick={this.handleDelete} className={this.props.selectedElements.length === 0 ? 'disabled' : ''}>
                            <DeleteForever />
                            Supprimer
                          </MenuItem>

                          <Divider />

                          <MenuItem onClick={this.handleDownload} className={this.props.selectedElements.length === 0 ? 'disabled' : ''}>
                            <CloudDownload />
                            Telecharger
                          </MenuItem>

                          <Divider />

                          <MenuItem onClick={this.handleConvert} className={this.props.selectedElements.length === 0 ? 'disabled' : ''}>
                            <Transform />
                            Convertir
                          </MenuItem>
                        </MenuList>
                      </Paper>
                    </div>
                  </ClickOutside>
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
      </Fragment>
    );
  }
}

Toolbar.propTypes = {
  cursor: PropTypes.object.isRequired,

  searchbar: PropTypes.bool.isRequired,
  toggleSelect: PropTypes.bool.isRequired,

  selectedElements: PropTypes.array.isRequired,

  onSearchbarUpdate: PropTypes.func.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  onCursorChange: PropTypes.func.isRequired,

  handleAddClick: PropTypes.func.isRequired,
  handleNewFolderClick: PropTypes.func.isRequired,
  handleRenameClick: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
  handleDownloadClick: PropTypes.func.isRequired,
  handleConvertClick: PropTypes.func.isRequired,


};
export default (Toolbar);
