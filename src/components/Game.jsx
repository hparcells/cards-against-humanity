import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { withStyles } from '@material-ui/core/styles';
import Beforeunload from 'react-beforeunload';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
    marginTop: '35px'
  }
});

class Game extends Component {
  render() {
    const { classes, username, gameState, disconnect, start } = this.props;

    return (
      <div id='game-area'>
        <Beforeunload onBeforeunload={disconnect} />
        {
          !gameState.started
            ? gameState.players.length >= 4
              ? username === gameState.players[0].username
                ? <Button variant='outlined' color='primary' className={classes.button} onClick={start}>Start</Button>
                : <Button variant='outlined' color='primary' className={classes.button} disabled onClick={start}>Start (Only the Host Can Start the Game)</Button>
              : <Button variant='outlined' color='primary' disabled className={classes.button}>Start (Need {4 - gameState.players.length} More Players)</Button>
            : <p>ok started</p>
        }
      </div>
    );
  }
}

export default hot(withStyles(styles)(Game));
