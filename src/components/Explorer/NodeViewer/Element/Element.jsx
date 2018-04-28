/* eslint no-extend-native: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-plusplus: 0 */
/* eslint func-names: 0 */
import React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Divider from 'material-ui/Divider';

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

const Element = ({ name, isFolder, selected }) => {
  let icon = <File />;
  if (isFolder) {
    icon = <Folder />;
  } else {
    let ext = '';
    if (name.nthIndexOf('.', 2) !== -1) {
      ext = name.substring(name.indexOf('.'), name.nthIndexOf('.', 2));
    } else {
      ext = name.substring(name.indexOf('.'));
    }

    switch (ext) {
      case ('.avi'):
      case ('.mkv'):
      case ('.mp4'):
        icon = <Video />;
        break;
      case ('.mp3'):
      case ('.ogg'):
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
  /* TODO : voir comment recuperer un thumbnail du fichier */
  return (
    <Card className="elementContainer" raised={selected}>
      <div className="previewContainer">
        {icon}
      </div>
      <Divider />
      <CardContent className={`contentContainer ${selected ? 'selected' : ''}`}>
        <div className="contentIconContainer">
          {icon}
        </div>
        <Typography component="p" align="center" className="text">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default (Element);
