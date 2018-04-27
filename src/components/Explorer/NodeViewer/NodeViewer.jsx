/* global window */
import React, { Fragment } from 'react';
import Dropzone from 'react-dropzone';
import Grid from 'material-ui/Grid';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

import 'video.js';
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
      this.setState({ selectedElements: [...this.state.selectedElements, node] });
    } else {
      // Sinon, on clear la liste, et on ajoute l'element clické
      this.setState({ selectedElements: [node] });
    }
    console.log('click');
    console.log(this.state.selectedElements);
  }

  onDoubleClick(node) {
    console.log('double click');
    // Quand on doubleclick sur un dossier,
    // cursor = ses children
    // Sauf si c'est le dossier .. alors
    // cursor = son parent
    if (node.children) {
      console.log(node);
      this.props.onCursorChange(node);
    } else {
      // Quand on doubleclick sur un fichier
      // Ouvre l'action par defaut de ce fichier
    }
  }

  onOffClick() {
    console.log('off click');
    this.setState({ selectedElements: [] });
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


    const clicks = [];
    let timeout;
    // Gere le double click. C'est pas ouf mais ca marchouille
    const clickHandler = (event, child) => {
      event.stopPropagation();
      event.preventDefault();
      event.persist();

      clicks.push(new Date().getTime());
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        if (clicks.length > 1 && clicks[clicks.length - 1] - clicks[clicks.length - 2] < 200) {
          this.onDoubleClick(child);
        } else {
          this.onClick(event, child);
        }
      }, 200);
    };


    const childrens = cursor.children ? cursor.children.map(child =>
      (
        <span onClick={e => clickHandler(e, child)} className="node" key={child.name} role="button">
          <Element
            name={child.name}
            isFolder={!!child.children}
            selected={this.state.selectedElements.includes(child)}
          />
        </span>
      )) : null;
    const breadcrumbs = () => {
      let ret = '';
      let currentCursor = cursor;
      while (currentCursor.parent) {
        ret = `${currentCursor.parent.name} > ${ret}`;
        currentCursor = currentCursor.parent;
      }
      return ret;
    };

    /* Boucler dans cursor,
    creer une element graphique par folder/fichier */
    return (
      <div className="nv-container" onClick={this.onOffClick} role="button">
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
            <h1> {breadcrumbs()} {cursor.name} </h1>
            <Grid
              style={{ margin: 0, width: '100%' }}
              container
              direction="row"
            >
              {childrens ||
              /* En fonction du type du fichier, on ouvre la page qui lui correspond */
              <div> test </div> }
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
