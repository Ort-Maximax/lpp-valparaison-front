/* global FormData, window */
/* eslint no-param-reassign: 0 */
import React, { Fragment } from 'react';
import Grid from 'material-ui/Grid';

import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';

import fileDownload from 'js-file-download';

import axios from 'axios';
import uuidv1 from 'uuid';

import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import Radio from 'material-ui/Radio';

import openSocket from 'socket.io-client';

import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

import Spinner from 'img/components/Spinner';
import Toolbar from './Toolbar/Toolbar';

// import TreeViewer from './TreeViewer/TreeViewer';
import NodeViewer from './NodeViewer/NodeViewer';

import './styles/Explorer.css';


let clientId = null;
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
    switch (el.ext) {
      case ('.avi'):
      case ('.mkv'):
      case ('.webm'):
      case ('.mp4'):
      case ('.ogv'):
        el.type = 'video';
        break;
      case ('.mp3'):
      case ('.oga'):
      case ('.ogg'):
      case ('.wav'):
      case ('.flac'):
        el.type = 'sound';
        break;
      default:
        el.type = null;
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
  if (window.localStorage.getItem('auth')) {
    const auth = JSON.parse(window.localStorage.getItem('auth'));
    axios.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
    clientId = auth.user.id;
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
      convertDialog: false,
      deleteDialog: false,
      newFileName: '',
    };
  }

  componentWillMount() {
    setBearer();
    this.subscribe();
    this.getData(true);
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
    if (this.state.uploadQueue && this.state.uploadQueue.length > 0) {
      this.setState({ uploadQueue: [...this.state.uploadQueue, ...files] });
    } else {
      this.setState({ uploadQueue: [...files] });
    }

    const config = {
      onUploadProgress: progressEvent => console.log(progressEvent.loaded),
    };

    files.forEach((file) => {
      const data = new FormData();
      data.append('path', `${this.state.cursor.path}/${file.name}`);
      data.append('data', file);

      axios.put(`${this.props.apiUrl}/uploadFile`, data, config).then((res, index) => {
        file.uploaded = true;
        files[index] = file;
      }, (err) => {
        console.log(err);
        file.uploaded = true;
      });
    });
  }

  setDropzoneRef = (node) => {
    if (node &&
      (!this.state.dropzone || (this.state.dropzone && this.state.dropzone.node !== node.node))) {
      this.setState({ dropzone: node });
    }
  }

  getData = (loading) => {
    const axiosConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (this.state.cursor) {
      this.setState({ lastDir: this.state.cursor.name });
    }
    const retryTimer = 5000;
    this.setState({ loading });
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
          // TODO: a revoir, faire avec l'ID plutot
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

  clearUploadQueue = () => {
    if (this.state.uploadQueue) {
      this.setState({ uploadQueue: this.state.uploadQueue.filter(el => !el.uploaded) });
    }
  };

  subscribe = () => {
    const socket = openSocket(this.props.apiUrl);
    socket.on(`dataChange${clientId}`, () => {
      this.getData(false);
    });
  }

  handleAddClick = () => {
    if (this.state.dropzone) {
      this.state.dropzone.open();
    }
  }

  handleNewFolderClick = () => {
    const postData = {
      path: this.state.cursor.path,
    };
    axios.post(`${this.props.apiUrl}/createDirectory`, postData)
      .catch((err) => {
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
        .catch((err) => {
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
      // Ouvre la modal de confirmation de suppression
      this.setState({ deleteDialog: true });
    }
  }

  closeDeleteDialog = () => {
    this.setState({ deleteDialog: false });
  }

  confirmDelete = () => {
    const elements = this.state.selectedElements.map(el => el.path);
    axios.post(`${this.props.apiUrl}/removeElement`, elements);
    this.closeDeleteDialog();
  }

  cancelDelete = () => {
    this.closeDeleteDialog();
  }

  handleDownloadClick = () => {
    if (this.state.selectedElements.length > 0) {
      this.state.selectedElements.forEach((el) => {
        axios.get(`${this.props.apiUrl}/downloadFile?path=${encodeURIComponent(el.path)}`, { responseType: 'blob' })
          .then((response) => {
            fileDownload(response.data, el.name);
          });


        // window.open(`${this.props.apiUrl}/downloadFile?path=${encodeURIComponent(el.path)}`);
      });
    }
  }

  handleConvertClick = () => {
    if (this.state.selectedElements.length > 0 && !this.state.selectedElements[0].children) {
      this.setState({ convertDialog: true });
    }
  }

  closeConvertDialog = () => {
    this.setState({ convertDialog: false });
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

            <div className="spinner">
              <Spinner />
            </div>
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
                  uploadQueue={this.state.uploadQueue}
                  clearUploadQueue={this.clearUploadQueue}
                  toggleSelect={this.state.toggleSelect}

                  onCursorChange={this.onCursorChange}
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
          className="delete-dialog"
          animatiton="slideUp"
        >
          <Grid container direction="column" justify="space-between" alignItems="center">
            <h3>Confimer la suppression ?</h3>
            <Grid container item direction="row" justify="flex-end" alignItems="center">
              <Button onClick={this.confirmDelete} color="primary">
                Supprimer
              </Button>
              <Button onClick={this.cancelDelete} color="primary" autoFocus>
                Annuler
              </Button>
            </Grid>
          </Grid>
        </Rodal>

        <Rodal
          visible={this.state.renameDialog}
          onClose={this.closeRenameDialog}
          closeOnEsc
          showCloseButton={false}
          width={350}
          height={250}
          className="rename-dialog"
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

        {
          this.state.selectedElements[0] &&
          <Rodal
            visible={this.state.convertDialog}
            onClose={this.closeConvertDialog}
            closeOnEsc
            width={400}
            height={350}
            animation="slideUp"
          >
            <h3> Convertir {this.state.selectedElements[0].name}
            </h3>
            {
            this.state.selectedElements[0].type === 'sound' &&
            <Grid container direction="row">

              <Grid container item direction="column" xs={6}>
                <h5> Format </h5>
                <div>
                  <Radio value="mp3" />
                  mp3
                </div>
                <div>
                  <Radio value="oga" />
                  oga
                </div>
                <div>
                  <Radio value="flac" />
                  flac
                </div>
                <div>
                  <Radio value="wav" />
                  wav
                </div>
              </Grid>

              <Grid container item direction="column" xs={6}>
                <h5> Codec </h5>
                <div>
                  <Radio value="vorbis" id="c-vorbis" />
                  Vorbis
                </div>
              </Grid>
              <Button id="convert-button">
                Convertir !
              </Button>
            </Grid>
            }

            {
            this.state.selectedElements[0].type === 'video' &&
            <div> Une video </div>
            }

            {
            this.state.selectedElements[0].type === null &&
            <div> Aucune idée</div>
            }
          </Rodal>
        }
      </Fragment>

    );
  }
}
export default Explorer;
