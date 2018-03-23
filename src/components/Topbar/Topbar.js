import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';

import MenuIcon from 'material-ui-icons/Menu';

import Logo from '../../img/svg/Logo';

import './Topbar.css';

export default withAuth(class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null, width: 0, height: 0 };
    
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
    
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
      
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };


  render() {

    if (this.state.authenticated === null) return null;
    
    return (
      <div className='appBarContainer'>
        <AppBar position='static' color='primary'>
          <Toolbar>
            <IconButton color='inherit' aria-label='Menu'>
              <SvgIcon>
                <Logo />
              </SvgIcon>              
            </IconButton>
            <Typography variant='title' color='inherit' className='flex'>
              Valparaison
            </Typography>

            <div className='appBarLinks' style={{display: this.state.width >= 600 ? 'block' : 'none' }}>
              <Link to='/'>Home</Link>
              
              {this.state.authenticated ?
                <Fragment>              
                  <Link to='/protected'>Protected</Link>
                  <a  onClick={this.props.auth.logout}>Logout</a>
                </Fragment>
                :
                <Fragment>  
                  <Link to='/signup'>Inscription</Link>
                  <a  onClick={this.props.auth.login}>Login</a> 
                </Fragment>
              }
                           
            </div>

            <div className='appBarMenuButton' style={{display: this.state.width < 600 ? 'block' : 'none' }}>
              <IconButton onClick={this.toggleDrawer('left', true)}>
                <MenuIcon />                
              </IconButton>
            </div>

            <Drawer anchor="left" open={this.state.left} onClose={this.toggleDrawer('left', false)}>
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer('left', false)}
                onKeyDown={this.toggleDrawer('left', false)}
                className = 'list'
              >
              <List><Link to='/'>Home</Link></List>
              <Divider />

              {this.state.authenticated ?
                <Fragment>
                  <List><Link to='/protected'>Protected</Link></List>
                  <Divider />
                  <List><a  onClick={this.props.auth.logout}>Logout</a></List>
                </Fragment>
                :
                <Fragment>  
                  <List><Link to='/signup'>Inscription</Link></List>
                  <Divider />
                  <List><a  onClick={this.props.auth.login}>Login</a> </List>
                </Fragment>
              }
             
              </div>
            </Drawer>


          </Toolbar>
        </AppBar>      
      </div>
    );
  }
});