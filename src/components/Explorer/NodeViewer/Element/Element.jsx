/* global window */
/* eslint no-extend-native: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-plusplus: 0 */
/* eslint func-names: 0 */
import React, { Fragment } from 'react';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Divider from 'material-ui/Divider';
/*
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
*/

import File from '../../../../img/components/File';
import Folder from '../../../../img/components/Folder';
import Archive from '../../../../img/components/Archive';
import Picture from '../../../../img/components/Picture';
import Video from '../../../../img/components/Video';
import Music from '../../../../img/components/Music';

import './styles/Element.css';

String.prototype.nthIndexOf = function (pattern, n) {
  let i = -1;
  while (n-- && i++ < this.length) {
    i = this.indexOf(pattern, i);
    if (i < 0) break;
  }
  return i;
};

const Element = ({ node, isFolder, selected }) => {
  let icon = <File />;
  if (isFolder) {
    icon = <Folder />;
  } else {
    switch (node.ext) {
      case ('.avi'):
      case ('.mkv'):
      case ('.mp4'):
      case ('.ogv'):
        icon = <Video />;
        break;
      case ('.mp3'):
      case ('.oga'):
      case ('.flac'):
        icon = <Music />;
        break;
      case ('.jpg'):
      case ('.jpeg'):
      case ('.png'):
        icon = <Picture />;
        break;
      case ('.zip'):
      case ('.rar'):
      case ('.tar'):
        icon = <Archive />;
        break;
      default:
        icon = <File />;
    }
  }
  const width = window.innerWidth;
  /* TODO: voir comment recuperer un thumbnail du fichier */
  return (
    <Fragment>
      {
        isFolder ?
          <Card raised={selected}>
            <CardContent className={`folderContentContainer ${selected ? 'selected' : ''}`}>

              <div className="folderContentIconContainer">
                {icon}
              </div>


              <Typography component="p" align="center" className="text">
                {node.name}
              </Typography>
              {/*
              <IconButton style={{ height: 30, width: 20 }}>
                <MoreVertIcon />
              </IconButton>
              */}
            </CardContent>
          </Card>
      :
          <Card className="fileElementContainer" raised={selected}>
            <div className="filePreviewContainer">
              {icon}
            </div>
            <Divider />
            <CardContent className={`fileContentContainer ${selected ? 'selected' : ''}`}>
              {width > 400 &&
                <div className="fileContentIconContainer">
                  {icon}
                </div>
              }
              <Typography component="p" align="center" className="text">
                {node.name}
              </Typography>
              {/*
              <IconButton style={{ height: 30, width: 20 }}>
                <MoreVertIcon />
              </IconButton>
              */}

            </CardContent>
          </Card>
      }

    </Fragment>
  );
};

export default (Element);
