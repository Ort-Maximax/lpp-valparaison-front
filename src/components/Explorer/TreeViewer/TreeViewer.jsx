/* eslint no-param-reassign: 0 */
import React, { Fragment } from 'react';
import { Treebeard, decorators } from 'react-treebeard';

// import uuidv1 from 'uuid/v1';

import Input, { InputAdornment } from 'material-ui/Input';
import Paper from 'material-ui/Paper';
import Search from '@material-ui/icons/Search';
import * as filters from './filter';


const processData = (data) => {
  // Iterate over all nodes
  data.children.forEach((el) => {
    // add its path
    el.path = `${data.path}/${el.name.replace(' ', '\\ ')}`;
    // el.uuid = uuidv1();
    if (el.children) {
      // If this is a folder, store it's parent
      el.parent = data;
      // call the data processing function for its children
      processData(el);
    }
  });
  return data;
};

/* TODO : Get data from backend API */
// Emulate getting datas from the API
const apiData = {
  name: 'My Valparaiso',
  path: 'path/to/user/folder',
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
            { name: 'test.tar.gz' },
            { name: 'file.rar' },
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

apiData.root = true;
apiData.toggled = true;
const data = processData(apiData);

decorators.Header = ({ style, node }) => {
  let ext = '';
  let iconType = 'file-text';

  if (node.name.nthIndexOf('.', 2) !== -1) {
    ext = node.name.substring(node.name.indexOf('.'), node.name.nthIndexOf('.', 2));
  } else {
    ext = node.name.substring(node.name.indexOf('.'));
  }
  if (node.children) {
    if (node.toggled) {
      iconType = 'folder-open';
    } else {
      iconType = 'folder';
    }
  } else {
    switch (ext) {
      case ('.avi'):
      case ('.mkv'):
      case ('.mp4'):
        iconType = 'film';
        break;
      case ('.mp3'):
      case ('.ogg'):
      case ('.flac'):
        iconType = 'music';
        break;
      case ('.jpg'):
      case ('.jpeg'):
      case ('.png'):
        iconType = 'image';
        break;
      case ('.zip'):
      case ('.rar'):
      case ('.tar'):
        iconType = 'archive';
        break;
      default:
        iconType = 'file-text';
    }
  }
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

class TreeViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, cursor: data };
    this.onToggle = this.onToggle.bind(this);
    this.onFilterMouseUp = this.onFilterMouseUp.bind(this);
  }
  componentDidMount() {
    this.props.onCursorChange(this.state.cursor);
  }
  onToggle(node, toggled) {
    const { cursor } = this.state;
    if (cursor) {
      cursor.active = false;
    }

    node.active = true;
    // Click once = update the explorer, click twice : open or collapse tree view
    if (node.children && cursor.active) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
    console.log(node);
    this.props.onCursorChange(node);
  }

  onFilterMouseUp(e) {
    /* TODO : update cursor en même temps que la recherche */
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

export default(TreeViewer);
