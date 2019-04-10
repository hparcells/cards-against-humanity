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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ReactHtmlParser from 'react-html-parser';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
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
          {
            isCzar
              ? game.gameState.czarReady
                ? <Grid className='card' item xs={1}>
                  <Paper className={classes.paper} style={{ marginBottom: '10px' }}>Everyone has played. Pick the best white card(s).</Paper>
                </Grid>
                : <Grid className='card' item xs={1}>
                  <Paper className={classes.paper}>You are the Czar... wait for everyone to play.</Paper>
                </Grid>
              : hasPlayedCard
                ? !game.gameState.czarReady
                  ? game.gameState.playedWhiteCards[clientIndex].cards.map((card) => {
                    return (
                      <Grid className='card' item xs={1}>
                        <Paper className={classes.paper} style={{ marginBottom: '10px' }}>{ReactHtmlParser(card)}</Paper>
                      </Grid>
                    );
                  })
                  : <Grid className='card' item xs={1}>
                    <Paper className={classes.paper} style={{ marginBottom: '10px' }}>Wait for the Czar to pick the best white card(s).</Paper>
                  </Grid>
                : <Grid className='card' item xs={1}>
                  <Paper className={classes.paper}>Click on a card to play it.</Paper>
                </Grid>
          }
          {
            game.gameState.czarReady
              ? game.gameState.playedWhiteCards.map((player) => {
                return (
                  <Grid className='card' item xs={1} onClick={
                    isCzar
                      ? czarPick(player.username)
                      : null
                  }>
                    {
                      player.cards.map((card) => {
                        return (
                          <Paper className={classes.paper} style={{ marginBottom: '10px' }}>{ReactHtmlParser(card)}</Paper>
                        );
                      })
                    }
                  </Grid>
                );
              })
              : null
          }
        </Grid>

        <ExpansionPanel style={{ marginTop: '20px' }}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Scores</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Player</TableCell>
                  <TableCell>Awesome Points (10 to Win)</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  game.players.map((player, playerIndex) => {
                    return (
                      <TableRow key={player.username}>
                        <TableCell component='th' scope='row'>
                          {
                            playerIndex === game.gameState.czar
                              ? player.username === username
                                ? <strong>> {player.username} (You)</strong>
                                : `> ${player.username}`
                              : player.username === username
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
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <div id='hand'>
          <Typography variant='h4' style={{ marginBottom: '10px' }}>Your Hand:</Typography>
          <Grid container spacing={24}>
            <TransitionGroup component={React.Fragment}>
              {
                game.players.find((player) => {
                  return username === player.username;
                }).hand.map((card, cardIndex) => {
                  return (
                    <CSSTransition
                      key={card}
                      timeout={500}
                      classNames="item"
                    >
                      <Grid
                        className='card'
                        item xs={1} onClick={playCard(cardIndex)}>
                        <Paper className={classes.paper}>{ReactHtmlParser(card)}</Paper>
                      </Grid>
                    </CSSTransition>
                  );
                })
              }
            </TransitionGroup>
          </Grid>
        </div>
      </div>
    );
  }
}

export default hot(withStyles(styles)(TheActualGame));
