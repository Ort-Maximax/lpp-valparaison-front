import React, { Fragment } from 'react';
import Dropzone from 'react-dropzone';
import Grid from 'material-ui/Grid';
import 'video.js';
import './styles/NodeViewer.css';
import Element from './Element/Element';

class NodeViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.state = { disabled: false };
  }

  componentDidMount() {

  }

  onClick(node) {
    console.log('click');
    // Quand on click sur un dossier,
    // cursor = ses children
    // Sauf si c'est le dossier .. alors
    // cursor = son parent
    if (node.children) {
      console.log(node);
      this.props.onCursorChange(node);
    } else {
      // Quand on click sur un fichier
      // On ouvre une fenetre qui affiche les action possibles
    }
  }

  onDrop(files) {
    // Faire des trucs
    console.log(files);
    // Disable jusqu'a ce que le fichier soit uploadé
    this.setState({
      disabled: false,
    });
  }

  render() {
    const { cursor } = this.props;
    const childrens = cursor.children ? cursor.children.map(child =>
      (
        <span onClick={() => this.onClick(child)} key={child.name} role="button">
          <Element name={child.name} isFolder={!!child.children} />
        </span>
      )) : null;
    /* Boucler dans cursor,
    creer une element graphique par folder/fichier */
    return (
      <Fragment>

        { cursor &&
        <Fragment>
          <h1> {cursor.parent ? cursor.parent.name : ''} {'>'} {cursor.name} </h1>
          <Grid
            style={{ margin: 0, width: '100%' }}
            container
            direction="row"
          >
            {childrens ||
            /* En fonction du type du fichier, on ouvre la page qui lui correspond */
            <div> test </div> }
          </Grid>
        </Fragment>
        }
        <Dropzone onDrop={this.onDrop} disabled={this.state.disabled} className="dropzone">
          {'Click or drag & drop your files'}
        </Dropzone>
      </Fragment>
    );
  }
}

export default(NodeViewer);
