import React from 'react';
import Grid from 'material-ui/Grid';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';


import Crumb from './Crumb/Crumb';
import './styles/Breadcrumbs.css';

class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crumbs: [] };
  }

  componentWillReceiveProps(nextProps) {
    let currentCursor = nextProps.cursor;

    // Cherche cursor dans le breadcrumbs du state precedent
    const found = this.state.crumbs.find(element => element.key === currentCursor.uuid);

    // Si on ne trouve pas
    if (!found) {
      console.log(currentCursor.name);

      const crumbs = [<Crumb
        key={currentCursor.uuid}
        cursor={currentCursor}
        onCursorChange={this.props.onCursorChange}
        selected
      />];
      while (currentCursor.parent) {
        // Build the breadcrumbs block
        crumbs.unshift(<Crumb
          key={currentCursor.parent.uuid}
          cursor={currentCursor.parent}
          onCursorChange={this.props.onCursorChange}
        />);
        currentCursor = currentCursor.parent;
      }
      this.setState({ crumbs });
    } else {
      // Change le crumb selectionné
      const crumbs = this.state.crumbs.map(crumb =>
        Object.assign({}, crumb, { props: { ...crumb.props, selected: crumb.key === found.key } }));
      this.setState({ crumbs });
    }
  }

  /* TODO: Onclick des arrows, changer le curseur */
  /* TODO: Quand le breadcrumbs depasse de son parent,
   on choisit d'afficher un crumb en moins, et le fleches s'active */
  render() {
    return (
      <Grid
        style={{ margin: 0, width: '75%', padding: '0 10px' }}
        container
        direction="row"
      >
        <div className="arrow left"> <KeyboardArrowLeft /> </div>
        {this.state.crumbs}
        <div className="arrow right"> <KeyboardArrowRight /> </div>
      </Grid>
    );
  }
}

export default(Breadcrumbs);
