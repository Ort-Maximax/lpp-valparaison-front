/* global localStorage */
/* eslint jsx-a11y/anchor-is-valid: 0 */
/* eslint prefer-destructuring: 0 */

import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

/* Appbar */
import AppBar from 'material-ui/AppBar';
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

/* Icons */
import MenuIcon from 'material-ui-icons/Menu';
import HomeIcon from 'material-ui-icons/Home';
import ProtectedIcon from 'material-ui-icons/LockOutline';
import LoginIcon from 'material-ui-icons/Person';
import LogoutIcon from 'material-ui-icons/Close';

import Identicons from '../../libs/identicons-react/index';

import Logo from '../../img/components/Logo';

import './styles/Topbar.css';

class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  componentWillUnmount() {
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

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
    if (this.target1.contains(event.target)) {
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
    if (this.state.authenticated === null) return null;

    const { userMenuOpen } = this.state;

    let clientMail;
    let clientFirstName;
    // let clientLastName;

    if (localStorage.getItem('okta-token-storage') && localStorage.getItem('okta-token-storage') !== '{}') {
      clientMail = JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.email;
      const clientName = JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.name;
      clientFirstName = clientName.substr(0, clientName.indexOf(' '));
    }

    return (
      <section className="topBarContainer">
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton color="inherit" className="logoContainer" aria-label="Logo">
              <Logo className="logoIcon" />
            </IconButton>
            <Typography color="inherit" className="brand">
              Valparaiso
            </Typography>

            <section className="topBarLinks">

              <Link to="/">Home</Link>

              {this.state.authenticated &&
                <Fragment>
                  <Link to="/browse">Mon Valparaiso</Link>
                  <a onClick={this.props.auth.logout} role="Link">Logout</a>
                </Fragment>
                /*
                <Fragment>
                  <a onClick={this.props.auth.login} role="Link">Login</a>
                </Fragment>
                */
              }
            </section>

            <IconButton onClick={this.toggleDrawer('left', true)} className="topBarMenuButton">
              <MenuIcon />
            </IconButton>

            <ClickOutside onClickOutside={this.closeUserMenu}>
              <div
                ref={(node) => {
                    this.target1 = node;
                  }}
              >
                { clientMail &&
                <Button
                  variant="fab"
                  className="topbarLoggedUser"
                  onClick={this.toggleUserMenu}
                >
                  <Identicons id={clientMail} width={20} size={3} />
                </Button>
                  }
              </div>
              {/* Bug : la position intial est incorrect.
              Surement car le popper est crée avant que le target soit crée */}


              <Paper className={userMenuOpen ? 'user-menu visible' : 'user-menu hidden'}>
                <div className="user-menu-header">
                  <Typography variant="title" className="noselect">
                          Bonjour {clientFirstName} !
                  </Typography>
                </div>
                <MenuList role="menu">
                  {/* TODO: mettre les links */}
                  <MenuItem onClick={this.handleCloseUserMenu}>Profile</MenuItem>
                  <MenuItem onClick={this.handleCloseUserMenu}>My account</MenuItem>
                  <a onClick={this.props.auth.logout} role="Link">
                    <MenuItem onClick={this.handleCloseUserMenu}>Logout</MenuItem>
                  </a>
                </MenuList>
              </Paper>
            </ClickOutside>
            {!this.state.authenticated &&
            <Fragment>
              <Button variant="fab" onClick={this.props.auth.login} className="loginButton">
                <LoginIcon />
              </Button>
            </Fragment>
            }

            <Drawer anchor="left" open={this.state.left} onClose={this.toggleDrawer('left', false)}>
              <section
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer('left', false)}
                onKeyDown={this.toggleDrawer('left', false)}
                className="list"
              >
                <List>
                  <Link to="/">
                    <ListItem>
                      <ListItemIcon>
                        <HomeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Home" />
                    </ListItem>
                  </Link>
                  <Divider />

                  {this.state.authenticated &&
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
                      <a onClick={this.props.auth.logout} role="Link">
                        <ListItem>
                          <ListItemIcon>
                            <LogoutIcon />
                          </ListItemIcon>
                          <ListItemText primary="Logout" />
                        </ListItem>
                      </a>
                    </Fragment>
                  }
                </List>
              </section>
            </Drawer>
          </Toolbar>
        </AppBar>
      </section>
    );
  }
}

export default withAuth(Topbar);
