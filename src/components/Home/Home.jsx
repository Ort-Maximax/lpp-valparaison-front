import React from 'react';
import Particles from 'react-particles-js';
import particleConfig from 'libs/particleConfig';

import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import { Link } from 'react-router-dom';

import CrossPlatform from 'img/components/CrossPlatform';
import Piggy from 'img/components/PiggyBank';
import Fast from 'img/components/Rocket';


import './styles/Home.css';


const Home = () => (
  <section className="starsContainer">
    <Particles params={particleConfig} style={{ position: 'absolute' }} />
    <div className="mainPaper">
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="center"
        style={{ width: '100%', height: '100%', margin: 0 }}
      >
        <Grid container spacing={24} style={{ width: '100%', margin: 0 }}>
          <Grid item xs={12} style={{ width: '100%', margin: 0 }}>
            <h1>Bienvenu à <span className="brand">Valparaiso !</span></h1>
            <h3> Tous vos médias, sur tous vos écrans.</h3>
            <h5 id="hostname"> Hostname inconnu ...</h5>
          </Grid>

          <Grid
            className="cards"
            item
            container
            xs={12}
            direction="row"
            alignItems="center"
            justify="space-around"
            style={{ width: '100%', margin: 0 }}
          >
            <Paper className="paper">
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{ width: '100%', margin: 0 }}
              >
                <CrossPlatform id="cross-platform" />
                <h3> Cross-platform</h3>
                <h5>Uploadez une fois, regardez partout !</h5>
              </Grid>

            </Paper>

            <Paper className="paper">
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{ width: '100%', margin: 0 }}
              >
                <Piggy id="cheap" />
                <h3> Pas cher</h3>
                <h5>Payez pour ce que vous utilisez, 5Go gratuit</h5>
              </Grid>

            </Paper>

            <Paper className="paper">
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{ width: '100%', margin: 0 }}
              >
                <Fast id="fast" />
                <h3> Super rapide</h3>
                <h5>Pas de limite, tout le monde à pleine vitesse !</h5>
              </Grid>

            </Paper>
          </Grid>

          <div className="links">
            <Link to="/pricing" className="pricing-link">
              Découvrez nos offres et tarifs
            </Link>
          </div>

          <div className="footer" >
            Made with <span role="img" aria-label="heart">❤️</span> by Clément S.
          </div>
        </Grid>


      </Grid>


    </div>
  </section>
);

export default(Home);
