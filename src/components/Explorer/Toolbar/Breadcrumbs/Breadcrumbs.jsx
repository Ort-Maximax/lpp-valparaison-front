/* eslint no-param-reassign: 0 */
import React from 'react';
import Grid from 'material-ui/Grid';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';


import Crumb from './Crumb/Crumb';
import './styles/Breadcrumbs.css';

class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crumbs: [], currentCursor: props.cursor };
  }
  componentWillMount() {
    this.buildBreadCrumbs(this.props.cursor);
  }

  componentWillReceiveProps(nextProps) {
    this.buildBreadCrumbs(nextProps.cursor);
  }

  buildBreadCrumbs(currentCursor) {
    if (Object.keys(currentCursor).length > 0) {
      this.setState({ currentCursor });
      // Cherche cursor dans le breadcrumbs du state precedent
      const found = this.state.crumbs.find(element => element.key === currentCursor.key);

      // Si on ne trouve pas
      if (!found) {
        const crumbs = [<Crumb
          key={currentCursor.key}
          cursor={currentCursor}
          onCursorChange={this.props.onCursorChange}
          selected
        />];
        while (currentCursor.parent) {
          // Build the breadcrumbs block
          crumbs.unshift(<Crumb
            key={currentCursor.parent.key}
            cursor={currentCursor.parent}
            onCursorChange={this.props.onCursorChange}
          />);
          currentCursor = currentCursor.parent;
        }
        this.setState({ crumbs });
      } else {
        // Change le crumb selectionné
        const crumbs = this.state.crumbs.map(crumb =>
          Object.assign(
            {},
            crumb, { props: { ...crumb.props, selected: crumb.key === found.key } },
          ));
        this.setState({ crumbs });
      }
    }
  }

  /* TODO: Quand le breadcrumbs depasse de son parent,
   on choisit d'afficher un crumb en moins */
  render() {
    const arrowClick = (direction) => {
      const index = this.state.crumbs.findIndex(el => el.key === this.state.currentCursor.key);
      switch (direction) {
        case '>':
          // Si l'index n+1 existe, on selectionne le cursor de cet index
          if (this.state.crumbs[index + 1]) {
            this.props.onCursorChange(this.state.crumbs[index + 1].props.cursor);
          }
          break;
        case '<':
          // Si l'index n-1 existe, on selectionne le cursor de cet index
          if (this.state.crumbs[index - 1]) {
            this.props.onCursorChange(this.state.crumbs[index - 1].props.cursor);
          }
          break;
        default:
          break;
      }
    };
    return (
      <Grid
        style={{
          margin: 0, width: '100%', height: 36, padding: '0',
        }}
        container
        direction="row"
      >
        <div className="arrow left" onClick={() => arrowClick('<')} role="button"> <KeyboardArrowLeft /> </div>
        {this.state.crumbs}
        <div className="arrow right" onClick={() => arrowClick('>')} role="button"> <KeyboardArrowRight /> </div>
      </Grid>
    );
  }
}

export default(Breadcrumbs);
