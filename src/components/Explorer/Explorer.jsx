/* eslint no-param-reassign: 0 */
import React from 'react';
import Grid from 'material-ui/Grid';

import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';

import axios from 'axios';
import uuidv1 from 'uuid';

import Toolbar from './Toolbar/Toolbar';
// import TreeViewer from './TreeViewer/TreeViewer';
import NodeViewer from './NodeViewer/NodeViewer';

import './styles/Explorer.css';

import DownloadView from '../DownloadView/DownloadView';

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
    if (el.children) {
      el.children = sortBy(el.children, x => x.name);
      // call the data processing function for its children
      processData(el);
    }
  });
  return data;
};

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.onSelectedElementsChange = this.onSelectedElementsChange.bind(this);
    this.state = {
      cursor: {},
      storedCursor: undefined,
      searchbar: false,
      toggleSelect: false,
      selectedElements: [],
    };
  }

  componentWillMount() {
    const axiosConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };


    /* TODO: Get data from backend API */
    // Pour l'instant on appelle l'API de  mockup
    axios(`${this.props.apiUrl}/getData`, axiosConfig)
      .then((res) => {
        console.log(res);
        const apiData = res.data;
        apiData.key = uuidv1();
        apiData.root = true;
        if (apiData.children && apiData.children.length > 0) {
          apiData.children = sortBy(apiData.children, x => x.name);
        }

        this.setState({ cursor: processData(apiData) });
      }, ((err) => {
          console.log(err);
        }));
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

  setDropzoneRef = (node) => {
    if (!this.state.dropzone) {
      this.setState({ dropzone: node });
    }
  }

  render() {
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
            onSearchbarUpdate={this.onSearchbarUpdate}
            onSearchQueryChange={this.onSearchQueryChange}
            onToggleSelect={this.onToggleSelect}
            onCursorChange={this.onCursorChange}
            cursor={this.state.cursor}
            searchbar={this.state.searchbar}
            selectedElements={this.state.selectedElements}
            toggleSelect={this.state.toggleSelect}
            dropzone={this.state.dropzone}
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
            onCursorChange={this.onCursorChange}
            onPlaylistChange={this.props.onPlaylistChange}
            onSelectedElementsChange={this.onSelectedElementsChange}
            apiUrl={this.props.apiUrl}
            cursor={this.state.cursor}
            selectedElements={this.state.selectedElements}
            toggleSelect={this.state.toggleSelect}
            setDropzoneRef={this.setDropzoneRef}
            flex="true"
          />
        </Grid>

        <section className="dl-view" >
          <DownloadView />
        </section>

      </Grid>
    );
  }
}
export default Explorer;
