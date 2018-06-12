import React from 'react';
import Grid from 'material-ui/Grid';

import PricingCard from '../PricingCard/PricingCard';

import './styles/Pricings.css';
import '../../libs/stars.css';

import Logo from '../../img/components/Logo';

const Pricings = () => (
  <section className="starsContainer">
    <div id="stars" />
    <div id="stars2" />
    <div id="stars3" />
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="center"
      className="pricings-container"
    >
      <PricingCard icon={<Logo />} title="Vautour" price="0" description="Pour les plus pauvres" />

      <PricingCard icon={<Logo />} title="Aigle" price="14.99" description="Le seul vrai plan, en vrai" />

      <PricingCard icon={<Logo />} title="Pigeon" price="2000" description="Pour les  plus cons" />
    </Grid>
  </section>

);


export default Pricings;
