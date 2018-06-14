import React from 'react';
import Grid from 'material-ui/Grid';

import PricingCard from '../PricingCard/PricingCard';
import './styles/Pricings.css';
import '../../libs/stars.css';

import Vulture from '../../img/components/Vulture';
import Eagle from '../../img/components/Eagle';
import Pigeon from '../../img/components/Pigeon';

const vautourDesc = (
  <div className="pricing-desc">
    <div> 500 Mo</div>
    <div> 100 Mo / fichier</div>
  </div>);

const aigleDesc = (
  <div className="pricing-desc">
    <div> 5 Go</div>
    <div> 1 Go / fichier</div>
  </div>);

const pigeonDesc = (
  <div className="pricing-desc">
    <div> Thème bling-bling</div>
  </div>);

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
      <PricingCard icon={<Vulture />} title="Vautour" price="0" description={vautourDesc} />

      <PricingCard icon={<Eagle />} title="Aigle" price="14.99" description={aigleDesc} />

      <PricingCard icon={<Pigeon />} title="Pigeon" price="2000" description={pigeonDesc} />
    </Grid>
  </section>

);


export default Pricings;
