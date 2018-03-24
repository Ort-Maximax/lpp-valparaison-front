/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import identicons from '../identicons/index.js';

class Identicons extends React.Component{

  render() {
    var width = this.props.width
    var size = this.props.size
    var side = width/((size*2)-1)
    var color
    var rects = []
    identicons.generate(this.props.id, this.props, {
      start: function(value) {
        color = '#'+Math.abs(value).toString(16).substring(0, 6)
      },
      rect: function(x, y) {
        var rect = React.createElement('rect', {
          key: String(rects.length),
          x: String(Math.floor(x*side)),
          y: String(Math.floor(y*side)),
          width: String(Math.ceil(side)),
          height: String(Math.ceil(side)),
          style: { fill: color }
        })
        rects.push(rect)
      },
      end: function() {
      }
    })
    return React.createElement('svg', null, rects)
  }
}

export default (Identicons);
