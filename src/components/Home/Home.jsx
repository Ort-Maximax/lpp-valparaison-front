import React from 'react';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import './styles/stars.css';
import './styles/Home.css';

const Home = () => (
  <section className="starsContainer">
    <div id="stars" />
    <div id="stars2" />
    <div id="stars3" />
    <Paper className="mainPaper" elevation={4}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <h1>
            {'Bienvenue à Valparaiso !'}
          </h1>
          <h2 id="hostname"> Hostname inconnu ...</h2>
        </Grid>

        <Grid item xs={12}>
          <h2>
            {'C\'est plutot cool'}
          </h2>
        </Grid>


      </Grid>
    </Paper>
  </section>
);

export default(Home);
