import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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
    const { classes, username, gameState } = this.props;

    return (
      <div className={classes.root}>
        <Grid id='cards' container spacing={40} style={{margin: '10px'}}>
          {
            gameState.players.find((player) => {
              return username === player.username;
            }).hand.map((card) => {
              return (
                <Grid className='card' item xs={1}>
                  <Paper className={classes.paper}>{card}</Paper>
                </Grid>
              );
            })
          }
        </Grid>
      </div>
    );
  }
}

export default hot(withStyles(styles)(TheActualGame));
