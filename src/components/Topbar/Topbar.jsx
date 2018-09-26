/* global window, Blob, fetch */
/* eslint jsx-a11y/anchor-is-valid: 0 */
/* eslint prefer-destructuring: 0 */

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

/* Appbar */
import AppBar from 'material-ui/AppBar';
import Grid from 'material-ui/Grid';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';

/* Drawer */
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

/* User Menu */
import ClickOutside from 'react-click-outside';
import Paper from 'material-ui/Paper';
import { MenuItem, MenuList } from 'material-ui/Menu';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
/* Icons */
import MenuIcon from '@material-ui/icons/Menu';
import ProtectedIcon from '@material-ui/icons/LockOutline';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import LoginIcon from '@material-ui/icons/Person';
import LogoutIcon from '@material-ui/icons/Close';

import Identicons from 'libs/identicons-react/index';

import Logo from 'img/components/Logo';
import Google from 'img/components/Google';

import './styles/Topbar.css';

class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = { userMenuOpen: false };
  }

  onFailure = (error) => {
    console.log(error);
  }

  logout = () => {
    this.props.logout();
  };

  googleResponse = (response) => {
    const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });
    const options = {
      method: 'POST',
      body: tokenBlob,
      mode: 'cors',
      cache: 'default',
    };
    fetch(`${this.props.apiUrl}/auth/google`, options).then((r) => {
      if (r.ok) {
        r.json().then((auth) => {
          window.localStorage.setItem('auth', JSON.stringify(auth));
          this.props.authenticate();
          this.props.history.push('/browse');
        });
      } else {
        console.log(r);
      }
    });
  };

  toggleUserMenu = () => {
    this.setState({
      userMenuOpen: !this.state.userMenuOpen,
    });
  };

  closeUserMenu = () => {
    this.setState({
      userMenuOpen: false,
    });
  }

  handleCloseUserMenu = (event) => {
    if (this.userMenu.contains(event.target)) {
      return;
    }

    this.setState({ userMenuOpen: false });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };


  render() {
    if (this.props.isAuthenticated === null) return null;

    const { userMenuOpen } = this.state;

    let clientMail;
    let clientFirstName;
    // let clientLastName;

    if (this.props.isAuthenticated && window.localStorage.getItem('auth')) {
      const auth = JSON.parse(window.localStorage.getItem('auth'));
      clientMail = auth.user.email;
      clientFirstName = auth.user.firstName;
      // clientFirstName = clientName.substr(0, clientName.indexOf(' '));
    }

    return (
      <section className="topBarContainer">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Link to="/" className="brand">
              <Grid container direction="row" alignItems="center">
                <IconButton color="inherit" className="logoContainer" aria-label="Logo">
                  <Logo className="logoIcon" />
                </IconButton>
                <Typography color="inherit" className="title">
                  Valparaiso
                </Typography>
              </Grid>

            </Link>

            <section className="clickable">
              <section className="topBarLinks">
                {this.props.isAuthenticated &&
                <Fragment>
                  <Link to="/browse">Mon Valparaiso</Link>
                  {/*
            <a onClick={this.props.auth.logout} role="Link" style={{ color: 'red' }}>Déconnexion</a>
                  */}

                </Fragment>
                }
                <Link to="/pricing"> Nos offres </Link>
              </section>

              <IconButton onClick={this.toggleDrawer('left', true)} className="topBarMenuButton">
                <MenuIcon />
              </IconButton>

              <ClickOutside onClickOutside={this.closeUserMenu}>
                <div
                  ref={(node) => {
                    this.userMenu = node;
                  }}
                >
                  { clientMail ?
                    <Button
                      variant="fab"
                      className="topbarLoggedUser"
                      onClick={this.toggleUserMenu}
                    >
                      <Identicons id={clientMail} width={20} size={3} />
                    </Button>
                  :

                    <Button
                      variant="fab"
                      className="loginButton"
                      onClick={this.toggleUserMenu}
                    >
                      <LoginIcon style={{ color: 'black' }} />
                    </Button>
                  }
                </div>

                <Paper className={userMenuOpen ? 'user-menu visible' : 'user-menu hidden'}>
                  <div className="user-menu-header">
                    {
                      this.props.isAuthenticated ?
                        <Typography variant="title" className="noselect">
                          Bonjour {clientFirstName} !
                        </Typography>
                      :
                        <Fragment>
                          <GoogleLogin
                            clientId="979187681926-as6gk94f9pfhl2ob739rjn8lhnk37oqv.apps.googleusercontent.com"
                            onSuccess={this.googleResponse}
                            onFailure={this.googleResponse}
                            className="test"
                            tag="div"
                          >
                            <Button variant="fab" className="loginButton" >
                              <Google style={{ width: 20 }} />
                            </Button>

                          </GoogleLogin>
                        </Fragment>
                    }

                  </div>
                  {
                    this.props.isAuthenticated &&
                    <MenuList role="menu">
                      {/* TODO: mettre les links */}
                      <MenuItem onClick={this.handleCloseUserMenu}>Profile</MenuItem>
                      <MenuItem onClick={this.handleCloseUserMenu}>Mon compte</MenuItem>
                      <GoogleLogout
                        onLogoutSuccess={this.props.logout}
                        className="test"
                        tag="a"
                      >
                        <MenuItem onClick={this.handleCloseUserMenu} style={{ color: 'red' }}>Déconnexion</MenuItem>

                      </GoogleLogout>
                    </MenuList>
                  }

                </Paper>
              </ClickOutside>

              <Drawer anchor="left" open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                <section
                  tabIndex={0}
                  role="button"
                  onClick={this.toggleDrawer('left', false)}
                  onKeyDown={this.toggleDrawer('left', false)}
                  className="list"
                >
                  <List>
                    {this.props.isAuthenticated &&
                    <Fragment>
                      <Link to="/browse">
                        <ListItem>
                          <ListItemIcon>
                            <ProtectedIcon />
                          </ListItemIcon>
                          <ListItemText primary="Mon Valparaiso" />
                        </ListItem>
                      </Link>
                      <Divider />
                      <Link to="/pricing">
                        <ListItem>
                          <ListItemIcon>
                            <MoneyIcon />
                          </ListItemIcon>
                          <ListItemText primary="Nos offres" />
                        </ListItem>
                      </Link>
                      <Divider />
                      <GoogleLogout
                        onLogoutSuccess={this.props.logout}
                        className="test"
                        tag="a"
                      >
                        <ListItem>
                          <ListItemIcon>
                            <LogoutIcon style={{ color: 'red' }} />
                          </ListItemIcon>
                          <ListItemText primary="Déconnexion" />
                        </ListItem>
                      </GoogleLogout>
                    </Fragment>
                  }
                  </List>
                </section>
              </Drawer>
            </section>
          </Toolbar>
        </AppBar>
      </section>
    );
  }
}

Topbar.propTypes = {
  logout: PropTypes.func.isRequired,
  authenticate: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default withRouter(Topbar);
