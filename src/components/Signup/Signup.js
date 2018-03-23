import React, { Fragment, Component } from 'react';

import PropTypes from 'prop-types';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Card, { CardHeader } from 'material-ui/Card';
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

    /* TODO Mettre le token et l'url de base dans le contexte*/
    const apiToken = '00hrOoFyIT8AesDcuXxPpK6u_NtuWzb7yDKq5VQaz3';
    const baseUrl = 'https://dev-438691.oktapreview.com/';  
    
    const axiosConfig = {
      headers : {
        'Accept': `application/json`,
        'Content-Type': `application/json`,
        'Authorization': `SSWS ${apiToken}`,
      }
    };

    
    console.log(postData);

    axios.post(`${baseUrl}api/v1/users?activate=true`, postData, axiosConfig)
      .then(res => {
        console.log(res);
        console.log(res.data);
        //TODO : Redirect

      }, (err => {
        console.log(err);
      }))
  }

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Card className={classes.card}>
          <CardHeader
            title='Inscription'
          />
          <hr/>
          <ValidatorForm 
          className={classes.container}
          onSubmit={this.handleSubmit}
          autoComplete='off'>
            <Grid container spacing={24}>
              <Grid item sm={6} xs={12}>
                <TextValidator
                label='Nom'
                name='firstName'
                className={classes.textField}
                value={this.state.firstName}
                onChange={this.handleChange('firstName')}
                margin='normal'
                required
                autoCorrect='off'
                fullWidth
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextValidator
                name='lastName'
                label='Prenom'
                className={classes.textField}
                value={this.state.lastName}
                onChange={this.handleChange('lastName')}
                margin='normal'
                required
                autoCorrect='off'
                fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextValidator
                name='email'
                label='Email'
                className={classes.textField}
                value={this.state.email}
                onChange={this.handleChange('email')}
                type='email'
                margin='normal'
                required
                autoCorrect='off'
                fullWidth
                />
              </Grid>

              <Grid item xs={12}>                
                <Button variant='raised' color='primary' className='button' type='submit' fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </ValidatorForm>
        </Card>

        
      </Fragment>
    );
  }
};

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);
