import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minWidth: '13%',
    minHeight: '100px'
  }
});

class TheActualGame extends Component {
  render() {
    const { classes, username, gameState, playCard } = this.props;
    
    const isCzar = gameState.players.indexOf(gameState.players.find((player) => {
      return username === player.username;
    })) === gameState.gameState.czar;
    const hasPlayedCard = gameState.gameState.playedWhiteCards.some((object) => object.username === username);
    const clientIndex = gameState.gameState.playedWhiteCards.indexOf(gameState.gameState.playedWhiteCards.find((player) => {
      return username === player.username;
    }));

    return (
      <div className={classes.root}>
        <Grid id='played-cards' container spacing={24}>
          <Grid className='card' item xs={1}>
            {
              /* TODO: Handle two played white cards. */
            }
            <Paper className={'black-card ' + classes.paper}>{gameState.gameState.blackCard.text}</Paper>
          </Grid>
          <Grid className='card' item xs={1}>
            {
              isCzar
                ? <Paper className={classes.paper}>You are the Czar... wait for everyone to play.</Paper>
                : hasPlayedCard
                  // TODO: Handle two played white cards.
                  ? <Paper className={classes.paper}>{gameState.gameState.playedWhiteCards[clientIndex].card}</Paper>
                  : <Paper className={classes.paper}>Click on a card to play it.</Paper>
            }
          </Grid>
        </Grid>

        <div id='hand'>
          <Typography variant='h4' style={{ marginBottom: '10px' }}>Your Hand:</Typography>
          <Grid container spacing={24}>
            {
              gameState.players.find((player) => {
                return username === player.username;
              }).hand.map((card, cardIndex) => {
                return (
                  <Grid className='card' item xs={1} key={cardIndex} onClick={playCard(cardIndex)}>
                    <Paper className={classes.paper}>{card}</Paper>
                  </Grid>
                );
              })
            }
          </Grid>
        </div>
      </div>
    );
  }
}

export default hot(withStyles(styles)(TheActualGame));
