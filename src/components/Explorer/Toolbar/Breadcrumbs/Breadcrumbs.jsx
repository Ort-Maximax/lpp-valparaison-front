import React from 'react';
import Grid from 'material-ui/Grid';
import Crumb from './Crumb/Crumb';

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

  render() {
    return (
      <Grid
        style={{ margin: 0, width: '75%', padding: '0 10px' }}
        container
        direction="row"
      >
        {this.state.crumbs}
      </Grid>
    );
  }
}

export default(Breadcrumbs);
