# identicons-react

Simple module to create SVG identicons like the ones used by [GitHub](https://github.com/blog/1586-identicons).

![Identicon](https://raw.githubusercontent.com/gimenete/identicons-react/master/examples/identicon.png)

## Installing

```
npm install identicons-react --save
```

## Usage

```html
<div id="identicon"></div>
```

### Plain JavaScript

```javascript
var React = require('react')
var ReactDOM = require('react-dom')
var Identicons = require('identicons-react')

var mountNode = document.getElementById('identicon')
ReactDOM.render(React.createElement(Identicons, { id: 'username@example.com', width: 200, size: 5 }), mountNode)
```

### Using JSX

```javascript
var React = require('react')
var ReactDOM = require('react-dom')
var Identicons = require('identicons-react')

var mountNode = document.getElementById('identicon')
ReactDOM.render(<Identicons id='username@example.com' width={200} size={5} />, mountNode)
```
