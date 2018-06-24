/* global document */
import React, { Fragment } from 'react';

import Dropzone from 'react-dropzone';

import Grid from 'material-ui/Grid';

import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';

import CloudDown from 'img/components/CloudDown';
import IconButton from 'material-ui/IconButton';

import AudioPlayer from './AudioPlayer/AudioPlayer';
import UploadView from './UploadView/UploadView';

import NvContext from './NvContext/NvContext';
import Element from './Element/Element';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import './styles/NodeViewer.css';


class NodeViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
      contextMenu: false,
      dragDialogVisible: false,
      videoDialogVisible: false,
      uploadView: false,
      musicPlaylist: [],
      currentVideo: {},
    };

    this.selectedElements = this.props.selectedElements;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keypressFunction, false);
  }

  componentWillReceiveProps(nextProps) {
    this.selectedElements = nextProps.selectedElements;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keypressFunction, false);
  }

  onClick = (e, node) => {
    this.setState({ dragging: false, contextMenu: false });
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
  }

  onDoubleClick = (e, node) => {
    if (this.state.dragging || this.state.contextMenu || e.ctrlKey || this.props.toggleSelect) {
      return;
    }
    // Quand on doubleclick sur un dossier,
    // cursor = ses children
    if (this.props.toggleSelect) {
      this.onClick(e, node);
      return;
    }

    if (node.children) {
      this.props.onCursorChange(node);
    } else {
      /* TODO: En fonction de l'extension du fichier, ouvre la page adequat */
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
          this.onPlaylistChange({ name: node.name, src: `${this.props.apiUrl}/streamFile?path=${node.path}` });

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
    }
  }

  onOffClick = (e) => {
    this.setState({ dragging: false, contextMenu: false });
    if (!e.ctrlKey) {
      // this.setState({ selectedElements: [] });
      this.props.onSelectedElementsChange([]);
    }
  }

  onDragEnter = () => {
    this.showDragDialog();
  }

  onDragLeave = () => {
    this.hideDragDialog();
  }

  onDrop = (files) => {
    this.hideDragDialog();
    // TODO:
    // Upload les fichiers
    // Affiche la boite de dialogue d'upload ala gdrive
    this.setState({ uploadView: true });
    this.props.onDrop(files);
    // Disable jusqu'a ce que le fichier soit uploadé
  }

  onTouchmove = () => {
    this.setState({ dragging: true });
  }

  onPlaylistChange = (sound) => {
    this.setState({ musicPlaylist: [sound] });
    this.setState({ audioPlayer: true });
  }

  onToggleAudioPlayer = () => {
    this.setState({ audioPlayer: !this.state.audioPlayer });
  }

  keypressFunction = (e) => {
    // esc
    if (e.keyCode === 27) this.closeVideoDialog();
    // delete
    if (e.keyCode === 46) this.props.handleDeleteClick();
  }

  showDragDialog = () => {
    this.setState({ dragDialogVisible: true });
  }

  hideDragDialog = () => {
    this.setState({ dragDialogVisible: false });
  }

  hideUploadView = () => {
    this.setState({ uploadView: false });
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
            onContextMenu={() => this.setState({ contextMenu: true })}
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

                  <Rodal visible={this.state.dragDialogVisible} onClose={this.hideDragDialog} className="dnd-dialog" height={190}>
                    <Grid container layout="column" alignItems="center" justify="center">
                      <CloudDown />
                      <h2>Drop your files here to upload</h2>
                    </Grid>
                  </Rodal>

                </Grid>
              </Fragment>
              }

              {
                (filesElem && filesElem.length === 0)
                 && (folderChildren && folderChildren.length === 0) &&
                 <div className="nothing-here">
                   <h1 > {"Il n'y a rien ici"} </h1>
                   <IconButton onClick={this.props.handleAddClick}>
                     <CloudDown />
                   </IconButton>
                   <h3> {"Drag'n'Drop, ou cliquez sur l'icone pour ajouter des fichiers"} </h3>
                 </div>

              }

            </Dropzone>

            <VideoPlayer
              video={this.state.currentVideo}
              open={this.state.videoDialogVisible}
              closeDialog={this.closeVideoDialog}
            />

            <section className="dl-view" style={{ bottom: this.state.audioPlayer ? 100 : 50 }} >
              <UploadView
                visible={this.state.uploadView}
                onClose={this.hideUploadView}
                clearUploadQueue={this.props.clearUploadQueue}
                uploadQueue={this.props.uploadQueue}
              />
            </section>

            <AudioPlayer
              toggleAudioPlayer={this.onToggleAudioPlayer}
              playerCollapsed={this.state.audioPlayer}
              playlist={this.state.musicPlaylist}
            />
          </div>
        </ContextMenuTrigger>

        <ContextMenu id="nv-context-menu">
          <NvContext
            handleAddClick={this.props.handleAddClick}
            handleNewFolderClick={this.props.handleNewFolderClick}
            selectedElements={this.props.selectedElements}
            handleRenameClick={this.props.handleRenameClick}
            handleDeleteClick={this.props.handleDeleteClick}
            handleDownloadClick={this.props.handleDownloadClick}
            handleConvertClick={this.props.handleConvertClick}
          />
        </ContextMenu>


      </Fragment>
    );
  }
}

export default(NodeViewer);
