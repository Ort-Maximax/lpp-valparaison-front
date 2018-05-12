import React from 'react';
import Grid from 'material-ui/Grid';
import Resizable from 're-resizable';

import Toolbar from './Toolbar/Toolbar';
import TreeViewer from './TreeViewer/TreeViewer';
import NodeViewer from './NodeViewer/NodeViewer';

import './styles/Explorer.css';

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.onCursorChange = this.onCursorChange.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.state = { cursor: [], filter: '' };
  }

  onCursorChange(cursor) {
    this.setState({
      cursor,
    });
  }

  onFilterChange(filter) {
    this.setState({
      filter,
    });
  }

  render() {
    /* TODO : Composant Toolbar */
    return (
      <Grid
        style={{ margin: 0, width: '100%' }}
        className="explorer"
        container
        wrap="nowrap"
        direction="column"
      >
        <Grid
          style={{ margin: 0, width: '100%' }}
          container
          wrap="nowrap"
          direction="row"
        >
          <Toolbar
            onCursorChange={this.onCursorChange}
            onFilterChange={this.onFilterChange}
            cursor={this.state.cursor}
          />
        </Grid>
        <Grid
          style={{ margin: 0, width: '100%' }}
          className="explorer"
          container
          wrap="nowrap"
          direction="row"
        >
          <Resizable
            className="tree-resize"
          >
            <div flex="true">
              <TreeViewer
                onCursorChange={this.onCursorChange}
                cursor={this.state.cursor}
                filter={this.state.filter}
              />
            </div>
          </Resizable>

          <NodeViewer onCursorChange={this.onCursorChange} cursor={this.state.cursor} flex="true" />

        </Grid>
      </Grid>
    );
  }
}
export default (Explorer);
