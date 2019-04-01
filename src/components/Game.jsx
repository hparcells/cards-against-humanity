import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { withStyles } from '@material-ui/core/styles';
import Beforeunload from 'react-beforeunload';
import Button from '@material-ui/core/Button';

import TheActualGame from './TheActualGame';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
    marginTop: '35px'
  }
});

class Game extends Component {
  render() {
    const { classes, username, game, disconnect, start, playCard, czarPick } = this.props;

    return (
      <div id='game-area'>
        <Beforeunload onBeforeunload={disconnect} />
        {
          !game.started
            ? game.players.length >= 4
              ? username === game.players[0].username
                ? <Button variant='outlined' color='primary' className={classes.button} onClick={start}>Start with {game.players.length} Players</Button>
                : <Button variant='outlined' color='primary' className={classes.button} disabled onClick={start}>Start with {game.players.length} Players (Only the Host Can Start the Game)</Button>
              : <Button variant='outlined' color='primary' disabled className={classes.button}>Start ({game.players.length} of 4 Players)</Button>
            : <TheActualGame username={username} game={game} playCard={playCard} czarPick={czarPick} />
        }
      </div>
    );
  }
}

export default hot(withStyles(styles)(Game));
