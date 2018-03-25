/* global document */
/* eslint react/jsx-filename-extension: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';

/* TODO : faire les deux themes */
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#0077b8',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

function ThemedApp() {
  return (
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  );
}

ReactDOM.render(<ThemedApp />, document.getElementById('root'));
// BUG : race condition
registerServiceWorker();
