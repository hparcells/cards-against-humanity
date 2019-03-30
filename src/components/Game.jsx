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
    const { classes, disconnect } = this.props;

    return (
      <div id='game-area'>
        <Beforeunload onBeforeunload={disconnect} />
        <Button variant='outlined' color='primary' className={classes.button} onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }
}

export default hot(withStyles(styles)(Game));
