import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '@okta/okta-react';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';

import Logo from '../../img/svg/Logo';

import topbarStyles from './Topbar.css';

export default withAuth(class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  render() {
    if (this.state.authenticated === null) return null;

    const authButton = this.state.authenticated ?
    <Button color='inherit' onClick={this.props.auth.logout}>Logout</Button> :
    <Button color='inherit' onClick={this.props.auth.login}>Login</Button>;
    
    return (
      <div className='appBarContainer'>
        <AppBar position='static' color='primary'>
          <Toolbar>
            <IconButton className={topbarStyles.menuButton} color='inherit' aria-label='Menu'>
              <SvgIcon>
                <Logo />
              </SvgIcon>              
            </IconButton>
            <Typography variant='title' color='inherit' className='flex'>
              Valparaison
            </Typography>
            <Link to='/'>Home</Link>
            <Link to='/signup'>SignUp</Link>             
            <Link to='/protected'>Protected</Link> 
            {authButton}
          </Toolbar>
        </AppBar>      
      </div>
    );
  }
});