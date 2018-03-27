/* global window, localStorage */
/* eslint jsx-a11y/anchor-is-valid: 0 */
/* eslint prefer-destructuring: 0 */

import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';
import classNames from 'classnames';

/* Appbar */
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
/* import SvgIcon from 'material-ui/SvgIcon'; */

/* Drawer */
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

/* User Menu */
import Grow from 'material-ui/transitions/Grow';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Paper from 'material-ui/Paper';
import { MenuItem, MenuList } from 'material-ui/Menu';

/* Icons */
import MenuIcon from 'material-ui-icons/Menu';
import HomeIcon from 'material-ui-icons/Home';
import ProtectedIcon from 'material-ui-icons/LockOutline';
import LoginIcon from 'material-ui-icons/Person';
import LogoutIcon from 'material-ui-icons/Close';

import Identicons from '../../libs/identicons-react/index';

import Logo from '../../img/svg/Logo';

import './styles/Topbar.css';

class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, width: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  toggleUserMenu = () => {
    this.setState({
      userMenuOpen: !this.state.userMenuOpen,
    });
  };

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

    let clientId;
    let clientFirstName;
    // let clientLastName;

    if (localStorage.getItem('okta-token-storage') && localStorage.getItem('okta-token-storage') !== '{}') {
      clientId = JSON.parse(localStorage.getItem('okta-token-storage')).idToken.clientId;
      console.log(clientId);
      const clientName = JSON.parse(localStorage.getItem('okta-token-storage')).idToken.claims.name;
      clientFirstName = clientName.substr(0, clientName.indexOf(' '));
    }

    return (
      <div className="topBarContainer">
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton color="inherit" className="logoContainer" aria-label="Logo">
              <Logo className="logoIcon" />
            </IconButton>
            <Typography color="inherit" className="brand">
              Valparaiso
            </Typography>

            <div className="topBarLinks" style={{ display: this.state.width >= 600 ? 'block' : 'none' }}>

              <Link to="/">Home</Link>

              {this.state.authenticated &&
                <Fragment>
                  <Link to="/protected">Protected</Link>
                  <a onClick={this.props.auth.logout} role="Link">Logout</a>
                </Fragment>
                /*
                <Fragment>
                  <a onClick={this.props.auth.login} role="Link">Login</a>
                </Fragment>
                */
              }
            </div>

            <div className="topBarMenuButton" style={{ display: this.state.width < 600 ? 'block' : 'none' }}>
              <IconButton onClick={this.toggleDrawer('left', true)}>
                <MenuIcon />
              </IconButton>
            </div>

            <Manager>
              <Target>
                <div
                  ref={(node) => {
                      this.target1 = node;
                    }}
                >
                  { clientId &&
                  <Button
                    variant="fab"
                    className="topbarLoggedUser"
                    onClick={this.toggleUserMenu}
                    aria-owns={userMenuOpen ? 'menu-list-grow' : null}
                    aria-haspopup="true"
                  >
                    <Identicons id={clientId} width={20} size={3} />
                  </Button>
                  }
                </div>
              </Target>
              {/* Bug : la position intial est incorrect.
              Surement car le popper est crée avant que le target soit crée */}
              <Popper
                placement="bottom"
                eventsEnabled={userMenuOpen}
                className={classNames({
                   'popper-close': !userMenuOpen,
                  })}
              >
                <ClickAwayListener onClickAway={this.handleCloseUserMenu}>
                  <Grow in={userMenuOpen} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                    <Paper className="user-menu">
                      <div className="user-menu-header">
                        <Typography variant="title" className="noselect">
                          Bonjour {clientFirstName} !
                        </Typography>
                      </div>
                      <MenuList role="menu">
                        {/* TODO : mettre les links */}
                        <MenuItem onClick={this.handleCloseUserMenu}>Profile</MenuItem>
                        <MenuItem onClick={this.handleCloseUserMenu}>My account</MenuItem>
                        <a onClick={this.props.auth.logout} role="Link">
                          <MenuItem onClick={this.handleCloseUserMenu}>Logout</MenuItem>
                        </a>
                      </MenuList>
                    </Paper>
                  </Grow>
                </ClickAwayListener>
              </Popper>
            </Manager>
            {!this.state.authenticated &&
            <Fragment>
              <Button variant="fab" onClick={this.props.auth.login} className="loginButton">
                <LoginIcon />
              </Button>
            </Fragment>
            }

            <Drawer anchor="left" open={this.state.left} onClose={this.toggleDrawer('left', false)}>
              <div
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
                      <Link to="/protected">
                        <ListItem>
                          <ListItemIcon>
                            <ProtectedIcon />
                          </ListItemIcon>
                          <ListItemText primary="Protected" />
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
              </div>
            </Drawer>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withAuth(Topbar);
