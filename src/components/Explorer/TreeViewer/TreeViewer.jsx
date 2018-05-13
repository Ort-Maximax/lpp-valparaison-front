/* eslint no-param-reassign: 0 */
import React, { Fragment } from 'react';
import { Treebeard, decorators } from 'react-treebeard';

import Home from '@material-ui/icons/Home';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

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
    // Click once = update the explorer, click twice : open or collapse tree view
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
