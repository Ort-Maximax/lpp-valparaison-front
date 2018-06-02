/* global FormData */
/* eslint no-param-reassign: 0 */
import React, { Fragment } from 'react';
import Grid from 'material-ui/Grid';

import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';

import axios from 'axios';
import uuidv1 from 'uuid';

import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

import Snackbar from 'material-ui/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import Toolbar from './Toolbar/Toolbar';

// import TreeViewer from './TreeViewer/TreeViewer';
import NodeViewer from './NodeViewer/NodeViewer';

import './styles/Explorer.css';

import DownloadView from '../DownloadView/DownloadView';

const processData = (data) => {
  // Iterate over all nodes
  data.children.forEach((el) => {
    // add its path
    el.path = `${data.path}/${el.name}`;
    el.clicks = [];
    el.parent = data;
    // !!! Le backend devrais s'occuper de donner les clés !!!
    el.key = uuidv1();

    if (el.name.nthIndexOf('.', 2) !== -1) {
      el.ext = el.name.substring(el.name.indexOf('.'), el.name.nthIndexOf('.', 2)).toLowerCase();
    } else {
      el.ext = el.name.substring(el.name.indexOf('.')).toLowerCase();
    }
    if (el.children) {
      el.children = sortBy(el.children, x => x.name);
      // call the data processing function for its children
      processData(el);
    }
  });
  return data;
};

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.onSelectedElementsChange = this.onSelectedElementsChange.bind(this);
    this.state = {
      loading: true,
      cursor: {},
      storedCursor: undefined,
      searchbar: false,
      toggleSelect: false,
      selectedElements: [],
      deleteDialog: false,
      snackOpen: false,
      snackText: '',
    };
  }

  componentWillMount() {
    this.getData();
  }

  onSearchbarUpdate = () => {
    this.setState({ searchbar: !this.state.searchbar });
    this.setState({ storedCursor: undefined });
  }

  onSearchQueryChange = (query) => {
    if (query) {
      // Create a temporary cursor, container the filtered children of current folder
      if (!this.state.storedCursor) {
        this.setState({ storedCursor: this.state.cursor });
      }
      const searchCursor = {
        name: 'Recherche',
        key: 'xxxS34RCHxxx',
        children: [],
      };
      const lookup = (node) => {
        node.children.forEach((el) => {
          if (el.name.toUpperCase().includes(query.toUpperCase())) {
            searchCursor.children.push(el);
          }
          if (el.children && el.children.length > 0) {
            lookup(el);
          }
        });
      };
      lookup(this.state.cursor);
      searchCursor.children = uniqBy(searchCursor.children, e => e.key);
      this.setState({ cursor: searchCursor });
    } else if (this.state.storedCursor) {
      this.setState({ cursor: this.state.storedCursor });
    }
  }

  onToggleSelect = () => {
    this.setState({ toggleSelect: !this.state.toggleSelect });
  }

  onCursorChange = (cursor) => {
    this.setState({
      selectedElements: [],
      storedCursor: undefined,
      searchbar: false,
      cursor,
    });
  }

  onSelectedElementsChange = (elements) => {
    this.setState({ selectedElements: [...elements] });
  }

  onDrop = (files) => {
    console.log(files);

    if (this.state.uploadQueue && this.state.uploadQueue.length > 0) {
      this.setState({ uploadQueue: this.state.uploadQueue.concat(files) });
    } else {
      this.setState({ uploadQueue: files });
    }

    files.forEach((file) => {
      const data = new FormData();
      data.append('path', `${this.state.cursor.path}/${file.name}`);
      data.append('data', file);

      console.log(this.state.cursor);

      axios.put('http://valparaiso.fr:3009/uploadFile', data).then((res, index) => {
        // TODO: Flag le fichier comme uploadé
        file.uploaded = true;
        files[index] = file;
        this.getData();

        console.log(res);
      });
    });
  }

  setDropzoneRef = (node) => {
    if (!this.state.dropzone) {
      this.setState({ dropzone: node });
    }
  }

  getData = () => {
    const axiosConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    /* TODO: Get data from backend API */
    // Pour l'instant on appelle l'API de  mockup
    if (this.state.cursor) {
      this.setState({ lastDir: this.state.cursor.name });
    }

    this.setState({ loading: true });
    axios.get(`${this.props.apiUrl}/getData`, axiosConfig)
      .then((res) => {
        this.setState({ loading: false });
        console.log(res);
        const apiData = res.data;
        apiData.key = uuidv1();
        apiData.root = true;
        apiData.path = apiData.name;
        if (apiData.children && apiData.children.length > 0) {
          apiData.children = sortBy(apiData.children, x => x.name);
        }

        const newCursor = processData(apiData);


        if (this.state.lastDir) {
          // TODO: a revoir
          const getLastDir = (cursor) => {
            if (cursor.name === this.state.lastDir) {
              this.setState({ matchedLastDir: cursor });
            }
            if (cursor.children) {
              cursor.children.forEach(child => getLastDir(child));
            }
          };
          getLastDir(newCursor);
        }
        // TODO: a revoir
        this.setState({
          cursor: this.state.matchedLastDir ? this.state.matchedLastDir : newCursor,
        });
      }, ((err) => {
          console.log(err);
          this.setState({ loading: false });
        }));
  }

  handleDownloadClick = () => {
    if (this.state.selectedElements.length > 0) {
      console.log('Download  : ');
      // TODO: Telecharge chaque selectedElements
      this.state.selectedElements.forEach((el) => {
        window.open(`${this.props.apiUrl}/downloadFile?path=${el.path}`);
        /* axios.get(`${this.props.apiUrl}/downloadFile?path=${el.path}`).then((res) => {
          console.log(res);
        }); */
      });
      // Affiche ensuite la progression des telechargement en bas a droite
      // Et envoi une notification
    }
  }

  handleDeleteClick = () => {
    if (this.state.selectedElements.length > 0) {
      console.log('Delete !');
      // Ouvre la modal de confirmation de suppression
      this.setState({ deleteDialog: true });
    }
  }

  closeDeleteDialog = () => {
    this.setState({ deleteDialog: false });
  }

  confirmDelete = () => {
    // TODO: Delete
    this.state.selectedElements.forEach((el) => {
      axios.get(`${this.props.apiUrl}/removeFile?path=${el.path}`).then(() => {
        console.log(`Succes delete de ${el.path}`);
      });
    });

    this.setState({ snackOpen: true, snackText: 'Supression effectuée' });
    this.getData();

    this.closeDeleteDialog();
  }

  cancelDelete = () => {
    this.closeDeleteDialog();
  }

  handleConvertClick = () => {
    if (this.state.selectedElements.length > 0) {
      console.log('Convert !');
      // TODO: Ouvre un dialog de conversion,
      // qui propose les  conversions possible pour chaque selectedElements
      // Affiche ensuite la progression des conversions en bas a droite
      // Et envoi une notification
    }
  }

  handleAddClick = () => {
    console.log('Add !');
    // TODO: Ouvre l'explorer
    this.state.dropzone.open();
    // Envoi les  fichier selectionner au backend
    // l'API retourne les data updaté, rafraichis les datas
  }

  closeSnack = () => {
    this.setState({ snackOpen: false });
  }


  render() {
    return (
      <Fragment>
        <Grid
          style={{ margin: 0, width: '100%' }}
          className="explorer"
          container
          wrap="nowrap"
          direction="column"
        >
          { this.state.loading ?
            <div />

          :

            <Fragment>
              <Grid
                style={{ margin: 0, width: '100%' }}
                container
                wrap="nowrap"
                direction="row"
              >
                <Toolbar
                  cursor={this.state.cursor}
                  searchbar={this.state.searchbar}
                  selectedElements={this.state.selectedElements}
                  onSearchbarUpdate={this.onSearchbarUpdate}
                  onSearchQueryChange={this.onSearchQueryChange}
                  onToggleSelect={this.onToggleSelect}
                  onCursorChange={this.onCursorChange}
                  handleAddClick={this.handleAddClick}
                  handleDownloadClick={this.handleDownloadClick}
                  handleDeleteClick={this.handleDeleteClick}
                  handleConvertClick={this.handleConvertClick}
                  toggleSelect={this.state.toggleSelect}
                />
              </Grid>
              <Grid
                style={{
                  marginTop: 10,
                  width: '100.5%',
                  overflowY: 'auto',
                  maxHeight: '90vh',
                }}
                className="explorer"
                container
                wrap="nowrap"
                direction="row"
              >
                <NodeViewer
                  apiUrl={this.props.apiUrl}
                  cursor={this.state.cursor}
                  selectedElements={this.state.selectedElements}
                  toggleSelect={this.state.toggleSelect}

                  onCursorChange={this.onCursorChange}
                  onPlaylistChange={this.props.onPlaylistChange}
                  onSelectedElementsChange={this.onSelectedElementsChange}

                  handleAddClick={this.handleAddClick}
                  handleDownloadClick={this.handleDownloadClick}
                  handleDeleteClick={this.handleDeleteClick}
                  handleConvertClick={this.handleConvertClick}

                  setDropzoneRef={this.setDropzoneRef}
                  onDrop={this.onDrop}
                  flex="true"
                />
              </Grid>

              <section className="dl-view" >
                <DownloadView
                  uploadQueue={this.state.uploadQueue}
                />
              </section>
            </Fragment>
      }


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
          <Grid container direction="column" justify="space-between" alignItems="center">
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
          autoHideDuration={1000}
          onClose={this.closeSnack}
          contentprops={{
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
export default Explorer;
