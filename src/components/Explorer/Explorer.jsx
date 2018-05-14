/* eslint no-param-reassign: 0 */
import React from 'react';
import Grid from 'material-ui/Grid';

import uniqBy from 'lodash.uniqby';

import uuidv1 from 'uuid';

import Toolbar from './Toolbar/Toolbar';
// import TreeViewer from './TreeViewer/TreeViewer';
import NodeViewer from './NodeViewer/NodeViewer';

import './styles/Explorer.css';

const processData = (data) => {
  // Iterate over all nodes
  data.children.forEach((el) => {
    // add its path
    el.path = `${data.path}/${el.name.replace(' ', '\\ ')}`;
    el.clicks = [];
    el.parent = data;
    el.key = uuidv1();
    if (el.children) {
      // call the data processing function for its children
      processData(el);
    }
  });
  return data;
};

/* TODO: Get data from backend API */
// Emulate getting datas from the API
const apiData = {
  name: 'Home',
  path: 'path/to/user/folder',
  children: [
    {
      name: 'Folder 1',
      children: [
        {
          name: 'Folder 11',
          children: [
            { name: 'test1.tar.gz' },
            { name: 'file1.rar' },
          ],
        },
        {
          name: 'Folder $^3ç#?&',
          children: [
            { name: 'test2.tar.gz' },
            { name: 'file2.rar' },
          ],
        },
        {
          name: 'Folder qui a un nom qui, il se trouve, est très long et prend beaucoup d\'espace OMG ce nom est interminable',
          children: [
            { name: 'test3.tar.gz' },
            { name: 'file3.rar' },
          ],
        },
        { name: 'file.js', lastUpdated: '01/01/2001' },
        { name: 'file.html', lastUpdated: '02/02/2002' },
        { name: 'file.json', lastUpdated: '03/03/2003' },

        { name: 'file.avi', lastUpdated: '04/04/2004' },
        { name: 'file.mkv', lastUpdated: '05/05/2005' },
        { name: 'file.mp4', lastUpdated: '06/06/2006' },

        { name: 'file.mp3', lastUpdated: '07/07/2007' },
        { name: 'file.ogg', lastUpdated: '08/08/2008' },
        { name: 'file.flac', lastUpdated: '09/09/2009' },

        { name: 'file.jpg', lastUpdated: '10/10/2010' },
        { name: 'file.jpeg', lastUpdated: '11/11/2011' },
        { name: 'file.png', lastUpdated: '12/12/2012' },

      ],
    },
    {
      name: 'Folder 2',
      children: [
        {
          name: 'Folder 21',
          children: [
            { name: 'test4.tar.gz' },
            { name: 'file4.rar' },
          ],
        },
        { name: 'LoneFile.js' },
      ],
    },
    {
      name: 'Empty Folder',
      children: [],
    },
  ],
};

apiData.key = uuidv1();
apiData.root = true;
apiData.toggled = true;
const data = processData(apiData);

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.onSearchbarUpdate = this.onSearchbarUpdate.bind(this);
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.onCursorChange = this.onCursorChange.bind(this);
    this.state = { cursor: data, storedCursor: undefined, searchbar: false };
  }

  onSearchbarUpdate() {
    this.setState({ searchbar: !this.state.searchbar });
    this.setState({ storedCursor: undefined });
  }

  onSearchQueryChange(query) {
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

  onCursorChange(cursor) {
    /* TODO: Clear la recherche au changement de curseur */
    this.setState({
      storedCursor: undefined,
      searchbar: false,
      cursor,
    });
  }

  render() {
    /* TODO: Composant Toolbar */
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
            onCursorChange={this.onCursorChange}
            cursor={this.state.cursor}
            searchbar={this.state.searchbar}
          />
        </Grid>
        <Grid
          style={{ margin: 0, width: '100%' }}
          className="explorer"
          container
          wrap="nowrap"
          direction="row"
        >


          {/*
          <section flex="true" className="tree-resize">
            <TreeViewer
              onCursorChange={this.onCursorChange}
              cursor={this.state.cursor}
              data={data}
            />
          </section>
          */}
          <NodeViewer onCursorChange={this.onCursorChange} cursor={this.state.cursor} flex="true" />

        </Grid>
      </Grid>
    );
  }
}
export default (Explorer);
