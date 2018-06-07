/* global document */
import React, { Fragment } from 'react';

import Dropzone from 'react-dropzone';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import CloudDownload from '@material-ui/icons/CloudDownload';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Transform from '@material-ui/icons/Transform';

import Divider from 'material-ui/Divider';

import './styles/NodeViewer.css';
import Element from './Element/Element';
import VideoPlayer from './VideoPlayer/VideoPlayer';

import Add from '../../../img/components/Add';
// import Dropzone from '../../../libs/react-dropzone/dist/es/index';


class NodeViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
      dragDialogVisible: false,
      videoDialogVisible: false,
      currentVideo: {},
    };

    this.selectedElements = this.props.selectedElements;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillReceiveProps(nextProps) {
    this.selectedElements = nextProps.selectedElements;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  onClick = (e, node) => {
    this.setState({ dragging: false });
    // Si la touche CTRL est pressé, ou si on est en mode eselection
    if (e.ctrlKey || this.props.toggleSelect) {
      // On ajoute l'element clické a la liste d'elements selectionné
      // Ou on le supprime si il est deja dans la liste
      if (this.selectedElements.includes(node)) {
        const index = this.selectedElements.indexOf(node);
        this.selectedElements.splice(index, 1);
        this.props.onSelectedElementsChange(this.selectedElements);
        // this.setState({ selectedElements: this.state.selectedElements });
      } else {
        this.selectedElements.push(node);
        this.props.onSelectedElementsChange(this.selectedElements);
        // this.setState({ selectedElements: [...this.state.selectedElements, node] });
      }
    } else {
      // Sinon, on clear la liste, et on ajoute l'element clické
      // this.setState({ selectedElements: [node] });
      this.props.onSelectedElementsChange([node]);
    }
    console.log('click');
  }

  onDoubleClick = (e, node) => {
    if (this.state.dragging) {
      return;
    }
    /* TODO: check si pointer est toujours au dessus de l'element cible */
    console.log('double click');
    // Quand on doubleclick sur un dossier,
    // cursor = ses children
    if (this.props.toggleSelect) {
      this.onClick(e, node);
      return;
    }

    if (node.children) {
      console.log(node);
      this.props.onCursorChange(node);
    } else {
      /* TODO: En fonction de l'extension du fichier, ouvre la page adequat */
      console.log(node);
      switch (node.ext) {
        case ('.mkv'):
        case ('.webm'):
        case ('.ogv'):
        case ('.mp4'):
        case ('.mov'):
          /* TODO: pause audio */
          this.setState({
            videoDialogVisible: true,
            currentVideo: { name: node.name, src: `${this.props.apiUrl}/streamFile?path=${node.path}` },
          });
          break;
        case ('.avi'):
          // TODO: Propose la conversion vers un format video streamable
          break;
        case ('.mp3'):
        case ('.oga'):
        case ('.ogg'):
        case ('.wav'):
        case ('.flac'):
          this.props.onPlaylistChange({ name: node.name, src: `${this.props.apiUrl}/streamFile?path=${node.path}` });

          break;
        case ('.jpg'):
        case ('.jpeg'):
        case ('.png'):
          break;
        case ('.zip'):
        case ('.rar'):
        case ('.tar'):
          break;
        default:
          // TODO: Ouvre une modal qui demande comment ouvrir le fichier
          break;
      }
      // Si l'element est streamable, on lance le streaming
    }
  }

  onOffClick = (e) => {
    console.log('off click');
    if (!e.ctrlKey) {
      // this.setState({ selectedElements: [] });
      this.props.onSelectedElementsChange([]);
    }
  }

  onDragEnter = () => {
    this.showDragDialog();
    console.log('Drag Enter !');
  }

  onDragLeave = () => {
    this.hideDragDialog();
    console.log('Drag Leave !');
  }

  onDrop = (files) => {
    this.hideDragDialog();
    // TODO:
    // Upload les fichiers
    // Affiche la boite de dialogue d'upload ala gdrive
    this.props.onDrop(files);
    // Disable jusqu'a ce que le fichier soit uploadé
  }

  onTouchmove = () => {
    this.setState({ dragging: true });
  }

  escFunction = (e) => {
    if (e.keyCode === 27) this.closeVideoDialog();
  }

  showDragDialog = () => {
    this.setState({ dragDialogVisible: true });
  }

  hideDragDialog = () => {
    this.setState({ dragDialogVisible: false });
  }

  closeVideoDialog = () => {
    this.setState({ videoDialogVisible: false });
  }

  render() {
    const { cursor } = this.props;
    // Gere le double click. C'est pas ouf mais ca marchouille
    const clickHandler = (event, node) => {
      event.stopPropagation();
      event.preventDefault();
      event.persist();

      node.clicks.splice(0, node.clicks.length - 1);

      node.clicks.push(new Date().getTime());
      if (node.clicks.length > 1
          && node.clicks[node.clicks.length - 1] - node.clicks[node.clicks.length - 2] < 300) {
        this.onDoubleClick(event, node);
      } else {
        this.onClick(event, node);
      }
    };

    const filesChildren = cursor.children ? cursor.children.filter(child => !child.children) : null;

    const filesElem = filesChildren ? filesChildren.map(child =>
      (
        !child.children &&
        <span
          onTouchStart={e => this.onClick(e, child)}
          onTouchEnd={e => this.onDoubleClick(e, child)}
          onClick={e => clickHandler(e, child)}
          className="node"
          key={child.name}
          role="button"
        >
          <Element
            node={child}
            isFolder={!!child.children}
            selected={this.selectedElements.includes(child)}
            toggleSelect={this.props.toggleSelect}
          />
        </span>
      )) : null;

    const folderChildren = cursor.children ? cursor.children.filter(child => child.children) : null;

    const foldersElem = folderChildren ? folderChildren.map(child =>
      (
        child.children &&
          <span
            onTouchStart={e => this.onClick(e, child)}
            onTouchEnd={e => this.onDoubleClick(e, child)}
            onClick={e => clickHandler(e, child)}
            className="node"
            key={child.name}
            role="button"
          >
            <Element
              node={child}
              isFolder={!!child.children}
              selected={this.selectedElements.includes(child)}
              toggleSelect={this.props.toggleSelect}
            />
          </span>
      )) : null;

    return (
      <Fragment>
        <ContextMenuTrigger id="nv-context-menu">
          <div
            className="nv-container"
            onClick={e => this.onOffClick(e)}
            role="button"
          >
            <Dropzone
              onDrop={this.onDrop}
              disableClick
              className="dropzone"
              onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave}
              ref={(node) => { this.props.setDropzoneRef(node); }}
            >
              { cursor &&
              <Fragment>
                <Grid
                  style={{ margin: 0, width: '100%' }}
                  container
                  direction="column"
                  onTouchMove={this.onTouchmove}
                >
                  { foldersElem && foldersElem.length > 0 &&
                  <Grid
                    style={{ margin: 0, width: '100%' }}
                    container
                    direction="column"
                  >
                    <div> Dossiers </div>
                    <Grid
                      style={{ margin: 0, width: '100%' }}
                      container
                      direction="row"
                    >
                      {foldersElem}
                    </Grid>
                  </Grid>
                  }

                  { filesElem && filesElem.length > 0 &&
                  <Grid
                    style={{ margin: 0, width: '100%' }}
                    container
                    direction="column"
                  >
                    <div>  Fichiers </div>
                    <Grid
                      style={{ margin: 0, width: '100%' }}
                      container
                      direction="row"
                    >
                      {filesElem}
                    </Grid>
                  </Grid>
                  }

                  <Rodal visible={this.state.dragDialogVisible} onClose={this.hideDragDialog}>
                    <div>Drop your files here to upload</div>
                  </Rodal>
                </Grid>
              </Fragment>

              }

            </Dropzone>

            <VideoPlayer
              video={this.state.currentVideo}
              open={this.state.videoDialogVisible}
              closeDialog={this.closeVideoDialog}
            />
          </div>
        </ContextMenuTrigger>

        <ContextMenu id="nv-context-menu">
          <Paper className="noselect">
            {/* TODO: Bind les actions */}
            <MenuItem onClick={this.props.handleAddClick}>
              <Add style={{ width: 24, height: 24 }} />
              <b>Nouveau</b>
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={this.props.handleDownloadClick}
              disabled={this.props.selectedElements.length === 0}
            >
              <CloudDownload />
              <div>Telecharger</div>
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={this.props.handleDeleteClick}
              disabled={this.props.selectedElements.length === 0}
            >
              <DeleteForever />
              <div>Supprimer</div>
            </MenuItem>

            <Divider />
            <MenuItem
              onClick={this.props.handleConvertClick}
              disabled={this.props.selectedElements.length === 0}
            >
              <Transform />
              <div>Convertir</div>
            </MenuItem>
          </Paper>
        </ContextMenu>


      </Fragment>
    );
  }
}

export default(NodeViewer);
