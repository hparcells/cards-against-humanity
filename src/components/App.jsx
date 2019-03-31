import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import io from 'socket.io-client';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import Start from './Start';
import Game from './Game';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900]
    }
  },
  typography: {
    useNextVariants: true
  }
});
const styles = {
  root: {
    flexGrow: 1
  }
};

let SOCKET;

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      connected: false,
      game: {},
      usernameExistsDialog: false,
      badUsernameDialog: false,
      serverDisconnectDialog: false
    };
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  }
  connect = () => {
    const { username } = this.state;

    if(username === '' || username.length > 16) {
      this.setState({ badUsernameDialog: true });
      return;
    }

    // TODO: Update
    SOCKET = io('http://localhost:3000/');
    const CONNECT_TIMEOUT = setTimeout(() => {
      SOCKET.disconnect();
      this.setState({ serverDisconnectDialog: true });
    }, 1500);

    // When the client connects.
    SOCKET.on('connect', async() => {
      clearTimeout(CONNECT_TIMEOUT);
      SOCKET.emit('newPlayer', this.state.username);
    });
    // If the username already exists in the server.
    SOCKET.on('usernameExists', () => {
      this.setState({ usernameExistsDialog: true });
    });
    // New game data.
    SOCKET.on('updatedGame', (game) => {
      this.setState({ game: game });

      if(!this.state.connected) {
        this.setState({ connected: true });
      }
    });
    // If the server stops working.
    SOCKET.on('disconnect', () => {
      this.setState({
        connected: false,
        game: {}
      });
      SOCKET.disconnect();

      if(!this.state.usernameExistsDialog) {
        this.setState({ serverDisconnectDialog: true });
      }
    });
  }
  start = () => {
    SOCKET.emit('start');
    this.setState({
      game: {
        started: true
      }
    });
  }
  disconnect = () => {
    SOCKET.emit('playerDisconnect', this.state.username);
    SOCKET.close();
    this.setState({
      connected: false,
      game: {}
    });
  }
  handleDialogClose = (dialog) => () => {
    this.setState({ [dialog]: false });
  };

  render() {
    const { classes } = this.props;
    
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position='static' color='primary'>
            <Toolbar>
              <Typography variant='h6' color='inherit'>
                Cards Against Humanity
              </Typography>
            </Toolbar>
          </AppBar>

          {
            this.state.connected
              ? <Game username={this.state.username} gameState={this.state.game} disconnect={this.disconnect} start={this.start} />
              : <Start username={this.state.username} handleUsernameChange={this.handleUsernameChange} connect={this.connect} />
          }

          <Dialog
            open={this.state.usernameExistsDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleDialogClose('usernameExistsDialog')}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
          >
            <DialogTitle id='alert-dialog-slide-title'>Username Exists in Game</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-slide-description'>
                There is another person inside the game with the same username. Try again with another username or wait.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDialogClose('usernameExistsDialog')} color='primary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.badUsernameDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleDialogClose('badUsernameDialog')}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
          >
            <DialogTitle id='alert-dialog-slide-title'>Bad Username</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-slide-description'>
                Your username was invalid. Your username must not be blank and has to be at most 16 characters.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDialogClose('badUsernameDialog')} color='primary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.serverDisconnectDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleDialogClose('badUsernameDialog')}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
          >
            <DialogTitle id='alert-dialog-slide-title'>Server Disconnect</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-slide-description'>
                It seems that the server is offline or has stopped working. Please try again.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDialogClose('serverDisconnectDialog')} color='primary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default hot(withStyles(styles)(App));
