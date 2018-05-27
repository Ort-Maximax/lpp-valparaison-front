import React, { Fragment } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import Search from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SelectAll from '@material-ui/icons/SelectAll';
import CloudDownload from '@material-ui/icons/CloudDownload';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Transform from '@material-ui/icons/Transform';

import ClickOutside from 'react-click-outside';
import { MenuItem, MenuList } from 'material-ui/Menu';

import Button from '@material-ui/core/Button';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

import Input from '@material-ui/core/Input';

import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import './styles/Toolbar.css';


class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchQuery: '', deleteDialog: false };
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

  handleDownloadClick = () => {
    console.log('Download  : ');
    // TODO: Telecharge chaque selectedElements
    this.props.selectedElements.forEach((el) => {
      console.log(el.name);
    });
    this.closeActionMenu();
  }

  handleDeleteClick = () => {
    console.log('Delete !');
    this.setState({ deleteDialog: true });
    // TODO: Demande confirmation, puis supprime chaque selectedElements
    this.closeActionMenu();
  }

  closeDeleteDialog = () => {
    this.setState({ deleteDialog: false });
  }

  confirmDelete = () => {
    this.closeDeleteDialog();
  }

  cancelDelete = () => {
    this.closeDeleteDialog();
  }

  handleConvertClick = () => {
    console.log('Convert !');
    // TODO: Ouvre un dialog de conversion,
    // qui propose les  conversions possible pour chaque selectedElements
    this.closeActionMenu();
  }

  render() {
    const { actionMenuOpen } = this.state;
    if (Object.keys(this.props.cursor).length <= 0) return null;
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
            >
              <Grid item style={{ width: 'calc(100% - 160px)', padding: 0 }}>
                <Breadcrumbs
                  onCursorChange={this.props.onCursorChange}
                  cursor={this.props.cursor}
                />
              </Grid>

              <Grid item style={{ width: 160 }} container direction="row" justify="flex-end" alignItems="center">
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
                          <MenuItem onClick={this.handleDownloadClick}>
                            <CloudDownload />
                          Telecharger
                          </MenuItem>
                          <MenuItem onClick={this.handleDeleteClick}>
                            <DeleteForever />
                          Supprimer
                          </MenuItem>

                          <MenuItem onClick={this.handleConvertClick}>
                            <Transform />
                          Convert
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

        <Rodal
          visible={this.state.deleteDialog}
          onClose={this.closeDeleteDialog}
          closeOnEsc
          showCloseButton={false}
          width={460}
          height={120}
          animatiton="slideUp"
        >
          <Grid container direction="column" justify="space-between" alignItems="center" style={{ height: '100%' }}>
            <h3>Êtes vous sur de vouloir supprimer ces elements ?</h3>
            <Grid container item direction="row" justify="flex-end" alignItems="center">
              <Button onClick={this.confirmDelete} color="primary">
                Oui, supprimer
              </Button>
              <Button onClick={this.cancelDelete} color="primary" autoFocus>
                Non, annuler
              </Button>
            </Grid>

          </Grid>


        </Rodal>
      </Fragment>
    );
  }
}

export default (Toolbar);
