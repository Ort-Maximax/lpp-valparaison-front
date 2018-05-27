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

import Divider from '@material-ui/core/Divider';

import ClickOutside from 'react-click-outside';
import { MenuItem, MenuList } from 'material-ui/Menu';

import Button from '@material-ui/core/Button';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

import Input from '@material-ui/core/Input';

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import './styles/Toolbar.css';

import Add from '../../../img/components/Add';


class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '', deleteDialog: false, snackOpen: false, snackText: '',
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

  handleDownloadClick = () => {
    if (this.props.selectedElements.length > 0) {
      console.log('Download  : ');
      // TODO: Telecharge chaque selectedElements
      this.props.selectedElements.forEach((el) => {
        console.log(el.name);
      });
      // Affiche ensuite la progression des telechargement en bas a droite
      // Et envoi une notification
    }

    this.closeActionMenu();
  }

  handleDeleteClick = () => {
    if (this.props.selectedElements.length > 0) {
      console.log('Delete !');
      // Ouvre la modal de confirmation de suppression
      this.setState({ deleteDialog: true });
    }
    this.closeActionMenu();
  }

  closeDeleteDialog = () => {
    this.setState({ deleteDialog: false });
  }

  confirmDelete = () => {
    // TODO: Delete
    this.setState({ snackOpen: true, snackText: 'Supression effectuée' });

    this.closeDeleteDialog();
  }

  cancelDelete = () => {
    this.closeDeleteDialog();
  }

  handleConvertClick = () => {
    if (this.props.selectedElements.length > 0) {
      console.log('Convert !');
      // TODO: Ouvre un dialog de conversion,
      // qui propose les  conversions possible pour chaque selectedElements
      // Affiche ensuite la progression des conversions en bas a droite
      // Et envoi une notification
    }
    this.closeActionMenu();
  }

  handleAddClick = () => {
    console.log('Add !');
    // TODO: Ouvre l'explorer
    this.props.dropzone.open();
    // Envoi les  fichier selectionner au backend
    // l'API retourne les data updaté, rafraichis les datas
  }

  closeSnack = () => {
    this.setState({ snackOpen: false });
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
                          <MenuItem onClick={this.handleAddClick}>
                            <Add style={{ width: 24, height: 24 }} />
                            <b>Nouveau</b>
                          </MenuItem>

                          <Divider />

                          <MenuItem onClick={this.handleDownloadClick} className={this.props.selectedElements.length === 0 ? 'disabled' : ''}>
                            <CloudDownload />
                            Telecharger
                          </MenuItem>

                          <Divider />

                          <MenuItem onClick={this.handleDeleteClick} className={this.props.selectedElements.length === 0 ? 'disabled' : ''}>
                            <DeleteForever />
                            Supprimer
                          </MenuItem>

                          <Divider />

                          <MenuItem onClick={this.handleConvertClick} className={this.props.selectedElements.length === 0 ? 'disabled' : ''}>
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
            <h3>Confimer la suppression ?</h3>
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

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackOpen}
          autoHideDuration={6000}
          onClose={this.closeSnack}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.snackText}</span>}
          action={
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeSnack}
            >
              <CloseIcon />
            </IconButton>
          }
        />
      </Fragment>
    );
  }
}

export default (Toolbar);
