import React, { Fragment, Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import Button from 'material-ui/Button';
import Card from 'material-ui/Card';
import Grid from 'material-ui/Grid';

import axios from 'axios';

import Logo from '../../img/components/Logo';

import './styles/Signup.css';

class Signup extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const postData = {
      profile: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        login: this.state.email,
      },
    };

    /* TODO Mettre le token et l'url de base dans le contexte */
    const apiToken = '00hrOoFyIT8AesDcuXxPpK6u_NtuWzb7yDKq5VQaz3';
    const baseUrl = 'https://dev-438691.oktapreview.com/';

    const axiosConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `SSWS ${apiToken}`,
      },
    };


    // console.log(postData);

    axios.post(`${baseUrl}api/v1/users?activate=true`, postData, axiosConfig)
      .then((res) => {
        console.log(res);
        // console.log(res.data);
        // TODO : Redirect
      }, ((err) => {
          console.log(err);
        }));
  }

  render() {
    return (
      <Fragment>
        <Card className="card">
          <div
            className="header"
          >
            <div className="logoContainer">
              <Logo className="logoIcon" />
            </div>
          </div>

          <div className="cardContent">

            <h2 className="form-head"> {'S\'inscrire'} </h2>
            <ValidatorForm
              className="form-container"
              onSubmit={this.handleSubmit}
              autoComplete="off"
            >
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <TextValidator
                    label="Nom"
                    name="firstName"
                    className="textField"
                    value={this.state.firstName}
                    onChange={this.handleChange('firstName')}
                    margin="normal"
                    required
                    autoCorrect="off"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextValidator
                    name="lastName"
                    label="Prenom"
                    className="textField"
                    value={this.state.lastName}
                    onChange={this.handleChange('lastName')}
                    margin="normal"
                    required
                    autoCorrect="off"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    name="email"
                    label="Email"
                    className="textField"
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                    type="email"
                    margin="normal"
                    required
                    autoCorrect="off"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button variant="raised" color="primary" className="button" type="submit" fullWidth>
                    Inscription
                  </Button>
                </Grid>
              </Grid>
            </ValidatorForm>
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default (Signup);
