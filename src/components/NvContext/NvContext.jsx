import React from 'react';

import CloudDownload from '@material-ui/icons/CloudDownload';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Transform from '@material-ui/icons/Transform';

import Paper from 'material-ui/Paper';

import { MenuItem } from 'react-contextmenu';

import Divider from 'material-ui/Divider';

const NvContext = props => (
  <Paper className="noselect">
    {/* TODO: Bind les actions */}
    <MenuItem onClick={props.handleAddClick}>
      <b>Nouveau fichier</b>
    </MenuItem>
    <Divider />

    <MenuItem
      onClick={props.handleNewFolderClick}
      disabled={props.selectedElements.length !== 0}
    >
      <div>Nouveau Dossier</div>
    </MenuItem>

    <Divider />

    <MenuItem
      onClick={props.handleRenameClick}
      disabled={props.selectedElements.length !== 1}
    >
      <div>Renommer</div>
    </MenuItem>

    <Divider />

    <MenuItem
      onClick={props.handleDeleteClick}
      disabled={props.selectedElements.length === 0}
    >
      <DeleteForever />
      <div>Supprimer</div>
    </MenuItem>

    <Divider />

    <MenuItem
      onClick={props.handleDownloadClick}
      disabled={props.selectedElements.length === 0}
    >
      <CloudDownload />
      <div>Telecharger</div>
    </MenuItem>

    <Divider />

    <MenuItem
      onClick={props.handleConvertClick}
      disabled={props.selectedElements.length !== 1 || !!props.selectedElements[0].children}
    >
      <Transform />
      <div>Convertir</div>
    </MenuItem>
  </Paper>);

export default NvContext;