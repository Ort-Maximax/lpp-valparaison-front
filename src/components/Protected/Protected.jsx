
import React from 'react';
import interact from 'interactjs';
import Grid from 'material-ui/Grid';
import TreeView from '../TreeView/TreeView';

import './styles/Protected.css';

function Protected() {
  interact('.tree-resize')
    .resizable({
      // resize from all edges and corners
      edges: {
        right: true,
      },

      // keep the edges inside the parent
      restrictEdges: {
        outer: 'parent',
        endOnly: true,
      },

      // minimum size
      restrictSize: {
        min: { width: 100, height: 50 },
      },

      inertia: true,
    })
    .on('resizemove', (event) => {
      const { target } = event;
      let x = (parseFloat(target.getAttribute('data-x')) || 0);
      let y = (parseFloat(target.getAttribute('data-y')) || 0);

      // update the element's style
      target.style.width = `${event.rect.width}px`;
      target.style.height = `${event.rect.height}px`;

      // translate when resizing from top or left edges
      x += event.deltaRect.left;
      y += event.deltaRect.top;

      target.style.webkitTransform = `translate( ${x}px, ${y}px)`;
      target.style.transform = `translate( ${x}px, ${y}px)`;
    });

  return (
    <Grid
      style={{ margin: 0, width: '100%' }}
      className="explorer"
      container
      wrap="nowrap"
      direction="row"
    >
      <div className="tree-resize" flex="true">
        {/* TODO : Lift state up,
        pour pouvoir partager le curseur entre le treeview et le nodeview */}
        <TreeView />
      </div>

      <div className="content" flex="true">
        {/* TODO : react dropzone sur tout content */}
        <div>Giga test maximal très puissant et imposant</div>
      </div>
    </Grid>
  );
}
export default (Protected);
