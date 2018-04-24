/* eslint no-param-reassign: 0 */
import React, { Fragment } from 'react';
import { Treebeard, decorators } from 'react-treebeard';
import Input, { InputAdornment } from 'material-ui/Input';
import Paper from 'material-ui/Paper';
import Search from '@material-ui/icons/Search';
import * as filters from './filter';


const data = {
  name: 'My Valparaiso',
  root: true,
  path: 'path/to/user/folder',
  toggled: true,
  children: [
    {
      name: 'Folder 1',
      children: [
        { name: 'file.js', lastUpdated: '01/01/2001' },
        { name: 'file.html', lastUpdated: '02/02/2002' },
        { name: 'file.json', lastUpdated: '03/03/2003' },

        { name: 'file.avi', lastUpdated: '04/04/2004' },
        { name: 'file.mkv', lastUpdated: '05/05/2005' },
        { name: 'file.mp4', lastUpdated: '06/06/2006' },

        { name: 'file.mp3', lastUpdated: '07/07/2007' },
        { name: 'file.ogg', lastUpdated: '08/08/2008' },
        { name: 'file.flac', lastUpdated: '09/09/2009' },

      ],
    },
    {
      name: 'Folder 2',
      children: [
        {
          name: 'Folder 21',
          children: [
            { name: 'decorators.js', path: 'path/to/decorator' },
            { name: 'treebeard.js', path: 'path/to/treebeard' },
          ],
        },
        { name: 'index.js' },
      ],
    },
  ],
};

decorators.Header = ({ style, node }) => {
  const iconType = node.children ? 'folder' : 'file-text';
  const iconClass = `fa fa-${iconType}`;
  const iconStyle = { marginRight: '5px' };

  return (
    <div style={style.base}>
      <div style={style.title}>
        <i className={iconClass} style={iconStyle} />

        {node.name}
      </div>
    </div>
  );
};

class TreeExample extends React.Component {
  constructor() {
    super();

    this.state = { data };
    this.onToggle = this.onToggle.bind(this);
    this.onFilterMouseUp = this.onFilterMouseUp.bind(this);
  }
  onToggle(node, toggled) {
    const { cursor } = this.state;

    if (cursor) {
      cursor.active = false;
    }

    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }

    this.setState({ cursor: node });
  }

  onFilterMouseUp(e) {
    const filter = e.target.value.trim();
    if (!filter) {
      return this.setState({ data });
    }
    let filtered = filters.filterTree(data, filter);
    filtered = filters.expandFilteredNodes(filtered, filter);
    return this.setState({ data: filtered });
  }

  render() {
    const { data: stateData } = this.state;

    return (
      <Fragment>
        <Paper
          style={{
            paddingBottom: 2,
            paddingLeft: 5,
            paddingRight: 5,
            marginBottom: 5,
            width: 'calc(100% - 11px)',
          }}
          square
        >
          <Input
            fullWidth
            onKeyUp={this.onFilterMouseUp}
            placeholder="Rechercher"
            endAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          />
        </Paper>
        <Treebeard
          data={stateData}
          decorators={decorators}
          onToggle={this.onToggle}
        />
      </Fragment>
    );
  }
}

export default(TreeExample);
