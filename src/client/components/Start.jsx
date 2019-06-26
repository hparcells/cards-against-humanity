import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  paperRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: '10px'
  },
  textField: {
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    margin: theme.spacing.unit,
    marginTop: '16px',
    height: '56px'
  }
});

class Start extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div id='connect-area'>
        <h1>Cards Against Humanity</h1>
        <Typography paragraph>Welcome to Cards Against Humanity! If you have never heard of it, it is basically where each round, one player asks a question from a Black Card, and everyone else answers with
          their funniest White Card. Things can get pretty R rated. This game functions the best on a computer instead of a mobile device.
        </Typography>
        <Paper className={classes.paperRoot} elevation={1}>
          <Typography variant='h5' component='h3'>
            Connect
          </Typography>
          <TextField
            id='username'
            label='Username'
            className={classes.textField}
            value={this.props.username}
            onChange={this.props.handleUsernameChange}
            margin='normal'
            variant='outlined'
          />
          <Button variant='outlined' color='primary' className={classes.button} onClick={this.props.connect}>
            Connect
          </Button>
        </Paper>
        <Paper className={classes.paperRoot}>
          <Typography variant='h5'>Publishing You Card Packs</Typography>
          <Typography paragraph>Want to get your custom pack in the game? I am always welome to add pack contributions to the game. Read the documentation
            at <a href='https://cards-against-humanity.netlify.com/#/custom-decks' target='_blank' rel='noreferrer noopener'>https://cards-against-humanity.netlify.com/#/custom-decks</a> and open a GitHub issue
            at <a href='https://github.com/hparcells/cards-against-humanity/issues' target='_blank' rel='noreferrer noopener'>https://github.com/hparcells/cards-against-humanity/issues</a>.</Typography>
        </Paper>
      </div>
    );
  }
}

export default hot(withStyles(styles)(Start));
