var React = require('react')
var ReactDOM = require('react-dom')
var Identicons = require('../')

var mountNode = document.getElementById('identicon')
ReactDOM.render(React.createElement(Identicons, { id: 'username@example.com', width: 200, size: 5 }), mountNode)
