import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
  },
  paperRoot: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  }
});

class TheActualGame extends Component {
  render() {
    const { classes, username, game, playCard, czarPick } = this.props;
    
    const isCzar = game.players.indexOf(game.players.find((player) => {
      return username === player.username;
    })) === game.gameState.czar;
    const hasPlayedCard = game.gameState.playedWhiteCards.some((object) => object.username === username);
    const clientIndex = game.gameState.playedWhiteCards.indexOf(game.gameState.playedWhiteCards.find((player) => {
      return username === player.username;
    }));

    return (
      <div className={classes.root}>
        <Grid id='played-cards' container spacing={24}>
          <Grid className='card' item xs={1}>
            <Paper className={'black-card ' + classes.paper}>{game.gameState.blackCard.text}</Paper>
          </Grid>
          <Grid className='card' item xs={1}>
            {
              isCzar
                ? game.gameState.czarReady
                  ? <Paper className={classes.paper} style={{ marginBottom: '10px' }}>Everyone has played. Pick the best white card(s).</Paper>
                  : <Paper className={classes.paper}>You are the Czar... wait for everyone to play.</Paper>
                : hasPlayedCard
                  ? game.gameState.playedWhiteCards[clientIndex].cards.map((card) => {
                    return <Paper className={classes.paper} style={{ marginBottom: '10px' }}>{card}</Paper>;
                  })
                  : <Paper className={classes.paper}>Click on a card to play it.</Paper>
            }
          </Grid>
          {
            isCzar && game.gameState.czarReady
              ? game.gameState.playedWhiteCards.map((player) => {
                return (
                  <Grid className='card' item xs={1} onClick={czarPick(player.username)}>
                    {
                      player.cards.map((card) => {
                        return (
                          <Paper className={classes.paper} style={{ marginBottom: '10px' }}>{card}</Paper>
                        );
                      })
                    }
                  </Grid>
                );
              })
              : null
          }
        </Grid>

        <Typography variant='h4' style={{ marginTop: '10px' }}>Scores:</Typography>
        <Paper className={classes.paperRoot}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player</TableCell>
                <TableCell>Awesome Points (10 to Win)</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                game.players.map((player) => {
                  return (
                    <TableRow key={player.username}>
                      <TableCell component='th' scope='row'>
                        {
                          username === player.username
                            ? <strong>{player.username} (You)</strong>
                            : player.username
                        }
                      </TableCell>
                      <TableCell>
                        {player.score}
                      </TableCell>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </Paper>

        <div id='hand'>
          <Typography variant='h4' style={{ marginBottom: '10px' }}>Your Hand:</Typography>
          <Grid container spacing={24}>
            {
              game.players.find((player) => {
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
