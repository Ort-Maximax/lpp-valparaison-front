/* global FormData, window */
/* eslint no-param-reassign: 0 */
import React, { Fragment } from 'react';
import Grid from 'material-ui/Grid';

import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';

import fileDownload from 'js-file-download';

import axios from 'axios';
import uuidv1 from 'uuid';

import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

import Input from 'material-ui/Input';
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

const setBearer = () => {
  if (window.localStorage.getItem('okta-token-storage') && window.localStorage.getItem('okta-token-storage') !== '{}') {
    const jwt = JSON.parse(window.localStorage.getItem('okta-token-storage')).idToken.idToken;
    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
  } else {
    window.setTimeout(setBearer, 1000);
  }
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
      renameDialog: false,
      deleteDialog: false,
      newFileName: '',
      snackOpen: false,
      snackText: '',
    };
  }

  componentWillMount() {
    setBearer();
    this.getData();
  }

  componentWillUnmount() {
    // this.unlisten();
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
      this.setState({ uploadQueue: [...this.state.uploadQueue, ...files] });
    } else {
      this.setState({ uploadQueue: [...files] });
    }

    files.forEach((file) => {
      const data = new FormData();
      data.append('path', `${this.state.cursor.path}/${file.name}`);
      data.append('data', file);

      console.log(this.state.cursor);

      axios.put(`${this.props.apiUrl}/uploadFile`, data).then((res, index) => {
        file.uploaded = true;
        files[index] = file;
        this.getData();

        console.log(res);
      }, (err) => {
        console.log(err);
        file.uploaded = true;
        this.getData();
      });
    });
  }

  setDropzoneRef = (node) => {
    if (node &&
       (!this.state.dropzone || (this.state.dropzone && this.state.dropzone.node !== node.node))) {
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
    const retryTimer = 5000;
    this.setState({ loading: true });
    const tryFetch = () => {
      axios.get(`${this.props.apiUrl}/getData`, axiosConfig)
        .then((res) => {
          this.setState({ loading: false });
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
          // TODO: a revoir, ne pas muter l'objet
          this.setState({
            cursor: this.state.matchedLastDir ? this.state.matchedLastDir : newCursor,
          });
        }, ((err) => {
            console.log(err);
            window.setTimeout(tryFetch, retryTimer);
          }));
    };
    tryFetch();
  }

  handleAddClick = () => {
    console.log('Add !');
    // TODO: Ouvre l'explorer
    if (this.state.dropzone) {
      console.log(this.state.dropzone);
      this.state.dropzone.open();
    }
  }

  handleNewFolderClick = () => {
    const postData = {
      path: this.state.cursor.path,
    };
    axios.post(`${this.props.apiUrl}/createDirectory`, postData)
      .then((res) => {
        console.log(res);
        this.getData();
      }, (err) => {
        console.log(err);
      });
  }

  handleRenameClick = () => {
    if (this.state.selectedElements.length === 1) {
      this.setState({ renameDialog: true, newFileName: this.state.selectedElements[0].name });
    }
  }

  closeRenameDialog = () => {
    this.setState({ renameError: '', newFileName: '', renameDialog: false });
  }

  newFilenameChange = (e) => {
    this.setState({ newFileName: e.target.value });
    if (e.target.value.includes('/') || e.target.value.includes('\\')) {
      this.setState({ renameError: 'Interdiction d\'utiliser "/" et "\\"' });
    } else {
      this.setState({ renameError: '' });
    }
  }

  confirmRename = () => {
    if (this.state.newFileName.includes('/') || this.state.newFileName.includes('\\')) {
      this.setState({ renameError: 'Interdiction d\'utiliser "/" et "\\"' });
    } else {
      const postData = {
        path: this.state.selectedElements[0].path,
        newName: this.state.newFileName,
      };

      axios.post(`${this.props.apiUrl}/renameElement`, postData)
        .then(() => {
          this.getData();
        }, (err) => {
          console.log(err);
        });

      this.closeRenameDialog();
    }
  }

  cancelRename = () => {
    this.closeRenameDialog();
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
    this.state.selectedElements.forEach((el) => {
      console.log(el.path);
      axios.get(`${this.props.apiUrl}/removeElement?path=${encodeURIComponent(el.path)}`).then(() => {
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

  handleDownloadClick = () => {
    if (this.state.selectedElements.length > 0) {
      console.log('Download  : ');
      this.state.selectedElements.forEach((el) => {
        console.log(el.name);
        axios.get(`${this.props.apiUrl}/downloadFile?path=${encodeURIComponent(el.path)}`)
          .then((response) => {
            fileDownload(response.data, el.name);
          });

        // window.open(`${this.props.apiUrl}/downloadFile?path=${encodeURIComponent(el.path)}`);
      });
    }
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
                  handleNewFolderClick={this.handleNewFolderClick}
                  handleRenameClick={this.handleRenameClick}
                  handleDeleteClick={this.handleDeleteClick}
                  handleDownloadClick={this.handleDownloadClick}
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
                  handleNewFolderClick={this.handleNewFolderClick}
                  handleRenameClick={this.handleRenameClick}
                  handleDeleteClick={this.handleDeleteClick}
                  handleDownloadClick={this.handleDownloadClick}
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

        <Rodal
          visible={this.state.renameDialog}
          onClose={this.closeRenameDialog}
          closeOnEsc
          showCloseButton={false}
          width={410}
          height={160}
          customStyles={{ padding: 0 }}
          animatiton="slideUp"
        >
          <Grid container direction="column" justify="space-between" alignItems="center" style={{ height: '100%' }}>
            <h3>Saisissez le nouveau nom</h3>
            <Input
              autoFocus
              value={this.state.newFileName}
              onChange={this.newFilenameChange}
              id="new-element-name"
            />

            <div style={{ color: 'red' }}> {this.state.renameError} </div>

            <Grid container item direction="row" justify="flex-end" alignItems="center">
              <Button onClick={this.cancelRename} color="primary">
                Annuler
              </Button>
              <Button onClick={this.confirmRename} color="primary" autoFocus>
                OK
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
