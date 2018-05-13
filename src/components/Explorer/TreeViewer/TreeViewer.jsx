/* eslint no-param-reassign: 0 */
import React, { Fragment } from 'react';
import { Treebeard, decorators } from 'react-treebeard';
// import uuidv1 from 'uuid';

import Home from '@material-ui/icons/Home';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

/* const processData = (data) => {
  // Iterate over all nodes
  data.children.forEach((el) => {
    // add its path
    el.path = `${data.path}/${el.name.replace(' ', '\\ ')}`;
    el.clicks = [];
    el.parent = data;
    el.uuid = uuidv1();
    if (el.children) {
      // call the data processing function for its children
      processData(el);
    }
  });
  return data;
};
*/

/* TODO: Get data from backend API */
// Emulate getting datas from the API
/*
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
            { name: 'test.tar.gz' },
            { name: 'file.rar' },
          ],
        },
        {
          name: 'Folder $^3ç#?&',
          children: [
            { name: 'test.tar.gz' },
            { name: 'file.rar' },
          ],
        },
        {
          name: 'Folder qui a un nom qui, il se trouve, est très long et prend beaucoup d\'espace',
          children: [
            { name: 'test.tar.gz' },
            { name: 'file.rar' },
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

apiData.uuid = uuidv1();
apiData.root = true;
apiData.toggled = true;
const data = processData(apiData);
*/

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

  const baseStyle = {
    width: 'calc(100% - 24px)',
    maxWidth: '25vw',
  };

  const titleStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  Object.assign(baseStyle, style.base);
  Object.assign(titleStyle, style.title);

  return (
    <div style={baseStyle}>
      <div style={titleStyle}>

        {
          node.root ?
          (<Home />)
          :

          (
            <Fragment>
              <i className={iconClass} style={iconStyle} />
              {node.name}
            </Fragment>
          )
        }

      </div>
    </div>
  );
};

decorators.Toggle = ({ style }) => (
  <div style={style.base}>
    <KeyboardArrowRight height={style.height} width={style.width} />
  </div>
);

class TreeViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: props.data, cursor: props.data };
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.props.onCursorChange(this.state.cursor);
  }

  componentWillReceiveProps() {
  }

  onToggle(node, toggled) {
    const { cursor } = this.state;
    if (cursor) {
      cursor.active = false;
    }

    node.active = true;
    // Click once = update the explorer, click twice : open or c  ollapse tree view
    if (node.children && cursor.active) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
    this.props.onCursorChange(node);
  }

  render() {
    const { data: stateData } = this.state;

    return (
      <section style={{ paddingTop: 10 }}>
        <Treebeard
          data={stateData}
          decorators={decorators}
          onToggle={this.onToggle}
        />
      </section>
    );
  }
}

export default(TreeViewer);
