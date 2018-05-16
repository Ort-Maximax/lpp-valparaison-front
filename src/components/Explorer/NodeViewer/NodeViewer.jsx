import React, { Fragment } from 'react';
import Dropzone from 'react-dropzone';
import Grid from 'material-ui/Grid';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import './styles/NodeViewer.css';
import Element from './Element/Element';


class NodeViewer extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onOffClick = this.onOffClick.bind(this);

    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.hideDragModal = this.hideDragModal.bind(this);
    this.showDragModal = this.showDragModal.bind(this);

    this.state = { disabled: false, dragModalVisible: false, selectedElements: [] };
  }

  componentDidMount() {

  }

  onClick(e, node) {
    // Si la touche CTRL est pressé
    if (e.ctrlKey) {
      // On ajoute l'element clické a la liste d'elements selectionné
      // Ou on le supprime si il est deja dans la liste
      if (this.state.selectedElements.includes(node)) {
        const index = this.state.selectedElements.indexOf(node);
        this.state.selectedElements.splice(index, 1);
        this.setState({ selectedElements: this.state.selectedElements });
      } else {
        this.setState({ selectedElements: [...this.state.selectedElements, node] });
      }
    } else {
      // Sinon, on clear la liste, et on ajoute l'element clické
      this.setState({ selectedElements: [node] });
    }
    console.log('click');
  }

  onDoubleClick(e, node) {
    /* TODO: check si pointer est toujours au dessus de l'element cible */
    console.log('double click');
    // Quand on doubleclick sur un dossier,
    // cursor = ses children
    if (node.children) {
      this.props.onCursorChange(node);
    } else {
      /* TODO: En fonction de l'extension du fichier, ouvre la page adequat */
      console.log(node);
      let ext = '';

      if (node.name.nthIndexOf('.', 2) !== -1) {
        ext = node.name.substring(node.name.indexOf('.'), node.name.nthIndexOf('.', 2));
      } else {
        ext = node.name.substring(node.name.indexOf('.'));
      }
      switch (ext) {
        case ('.avi'):
        case ('.mkv'):
        case ('.mp4'):
          break;
        case ('.mp3'):
        case ('.ogg'):
        case ('.flac'):
          if (node.name === 'file.flac') {
            this.props.onPlaylistChange({ name: node.name, src: 'http://www.terrillthompson.com/music/audio/smallf.mp3?id=blahblahblah' });
          } else {
            this.props.onPlaylistChange({ name: node.name, src: 'https://www.hrupin.com/wp-content/uploads/mp3/testsong_20_sec.mp3' });
          }
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
          break;
      }
      // Si l'element est streamable, on lance le streaming
    }
  }

  onOffClick(e) {
    console.log('off click');
    if (!e.ctrlKey) {
      this.setState({ selectedElements: [] });
    }
  }

  onDragEnter() {
    this.showDragModal();
    console.log('Drag Enter !');
  }

  onDragLeave() {
    this.hideDragModal();
    console.log('Drag Leave !');
  }

  onDrop(files) {
    // TODO
    // Upload les fichiers (demande confirmation?)
    // Affiche la boite de dialogue d'upload ala gdrive
    console.log(files);
    // Disable jusqu'a ce que le fichier soit uploadé
    this.setState({
      disabled: false,
    });
  }

  showDragModal() {
    this.setState({ dragModalVisible: true });
  }

  hideDragModal() {
    this.setState({ dragModalVisible: false });
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
            name={child.name}
            isFolder={!!child.children}
            selected={this.state.selectedElements.includes(child)}
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
              name={child.name}
              isFolder={!!child.children}
              selected={this.state.selectedElements.includes(child)}
            />
          </span>
      )) : null;

    return (
      <div className="nv-container" onClick={e => this.onOffClick(e)} role="button">
        <Dropzone
          onDrop={this.onDrop}
          disabled={this.state.disabled}
          disableClick
          className="dropzone"
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
        >
          { cursor &&
          <Fragment>
            <Grid
              style={{ margin: 0, width: '100%' }}
              container
              direction="column"
            >
              { foldersElem && foldersElem.length > 0 &&
                <Grid
                  style={{ margin: 0, width: '100%' }}
                  container
                  direction="column"
                >
                  <div>  Dossiers </div>
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

              <Rodal visible={this.state.dragModalVisible} onClose={this.hideDragModal}>
                <div>On est en train de drag !!!!</div>
              </Rodal>
            </Grid>
          </Fragment>
        }
        </Dropzone>
      </div>
    );
  }
}

export default(NodeViewer);
