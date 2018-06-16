import React from 'react';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import './styles/PricingCard.css';

const PricingCard = props => (
  <Paper className="pricing-paper">
    <Grid container direction="column" className="pricing-body">
      <div className="pricing-component icon"> {props.icon} </div>
      <div className="pricing-component title"> {props.title} </div>
      <div className="pricing-component price-tag"> {props.price} € </div>
      <div className="pricing-component description"> {props.description}  </div>
    </Grid>
  </Paper>
);

export default PricingCard;
