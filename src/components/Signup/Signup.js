import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Card, { CardHeader } from 'material-ui/Card';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import axios from 'axios';

const styles = theme => ({
  card: {
    minWidth: 400,
    maxWidth: '30%',
    margin: '0 auto',
    marginTop: 20,
    paddingBottom : 20,
  },
  container: {
    paddingLeft : 20,
    paddingRight : 20,
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  menu: {
    width: 200,
  },
});

class Signup extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
  }

  handleChange = name => event => {
    this.setState({
      [name] : event.target.value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const postData = {
      profile : {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        login: this.state.email
      }
    };

    const apiToken = "00hrOoFyIT8AesDcuXxPpK6u_NtuWzb7yDKq5VQaz3";

    const axiosConfig = {
      headers : {
        "Accept": `application/json`,
        "Content-Type": `application/json`,
        "Authorization": `SSWS ${apiToken}`,
      }
    };

    const baseUrl = 'https://dev-438691.oktapreview.com/';  
    console.log(postData);

    axios.post(`${baseUrl}api/v1/users?activate=true`, postData, axiosConfig)
      .then(res => {
        console.log(res);
        console.log(res.data);
        //Redirect

      }, (err => {
        console.log(err);
      }))
  }

  render() {
    const { classes } = this.props;

    /*
    TODO : Form validation
    */
    return (
      <Card className={classes.card}>
        <CardHeader
          title="Inscription"
          subtitle="Subtitle"
        />
        <hr/>
        <form className={classes.container} autoComplete='off'>
          <Grid container spacing={24}>
            <Grid item sm={6} xs={12}>
              <TextField
              label="Nom"
              className={classes.textField}
              value={this.state.firstName}
              onChange={this.handleChange('firstName')}
              margin="normal"
              required
              autoCorrect="off"
              fullWidth
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
              id="lastName"
              label="Prenom"
              className={classes.textField}
              value={this.state.lastName}
              onChange={this.handleChange('lastName')}
              margin="normal"
              required
              autoCorrect="off"
              fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              id="email"
              label="Email"
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange('email')}
              type='email'
              margin="normal"
              required
              autoCorrect="off"
              fullWidth
              />
            </Grid>

            <Grid item xs={12}>                
              <Button variant="raised" color="primary" className='button' type='submit' onClick={this.handleSubmit} fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    );
  }
};

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);
