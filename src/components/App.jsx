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
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import Start from './Start';
import Game from './Game';
import playSound from '../js/play-sound';

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
  },
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1
  }
};

let SOCKET;

function Transition(props) {
  return <Slide direction='up' {...props} />;
}
function TransitionLeft(props) {
  return <Slide {...props} direction='left' />;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Game
      username: '',
      connected: false,
      game: {},
      // Dialogs and text.
      dialog: {
        open: false,
        title: '',
        content: ''
      },
      endGameDialog: false,
      snackbarOpen: false,
      snackbarContent: '',
      // Post game.
      winner: '',
      clientScore: 0
    };
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  }
  connect = () => {
    const { username } = this.state;

    if(username === '' || username.length > 16) {
      this.setState({
        dialog: {
          open: true,
          title: 'Invalid Username',
          content: 'Your username was invalid. Your username must not be blank and has to be at most 16 characters.'
        }
      });
      
      return;
    }

    // TODO: Update
    SOCKET = io('http://cah.servegame.com:3000/');
    const CONNECT_TIMEOUT = setTimeout(() => {
      SOCKET.disconnect();
      this.setState({
        dialog: {
          open: true,
          title: 'Could Not Connect',
          content: 'The client took too long to connect to the server. The server may be down. Try again later.'
        }
      });
      
      playSound('dialog');
    }, 1500);

    // When the client connects.
    SOCKET.on('connect', async() => {
      clearTimeout(CONNECT_TIMEOUT);
      SOCKET.emit('newPlayer', this.state.username);
    });
    // If the username already exists in the server.
    SOCKET.on('usernameExists', () => {
      this.setState({
        dialog: {
          open: true,
          title: 'Username Exists in Game',
          content: 'There is another person inside the game with the same username. Try again with another username or wait.'
        }
      });
      playSound('dialog');
    });
    // New game data.
    SOCKET.on('updatedGame', (game) => {
      this.setState({ game: game });

      // Set state connected if not set already.
      if(!this.state.connected) {
        this.setState({ connected: true });
      }
    });
    // When the Czar picks the winner for the round.
    SOCKET.on('roundWinner', (username) => {
      this.setState({
        snackbarOpen: true,
        snackbarContent: `${username} won the round. Next round in three seconds.`
      });
      playSound('round-winner');
    });
    // When someone wins.
    SOCKET.on('winner', (winnerUsername, players) => {
      const clientIndex = players.indexOf(players.find((player) => {
        return this.state.username === player.username;
      }));
      
      this.setState({
        endGameDialog: true,
        winner: winnerUsername,
        clientScore: players[clientIndex].score
      });
      SOCKET.disconnect();
      playSound('winner');
    });
    // If there isn't enough people to continue the game.
    SOCKET.on('gameEndNotEnoughPlayers', () => {
      this.setState({
        dialog: {
          open: true,
          title: 'Not Enough Players',
          content: 'There were not enough players to continue the game, therefore the game was closed.'
        }
      });
      SOCKET.disconnect();

      playSound('dialog');
    });
    // If the server stops working.
    SOCKET.on('disconnect', () => {
      this.setState({
        connected: false,
        game: {}
      });
      SOCKET.disconnect();
      
      if(!this.state.usernameExistsDialog && !this.state.notEnoughPlayersDialog && !this.state.username === '') {
        this.setState({
          dialog: {
            open: true,
            title: 'Server Disconnect',
            content: 'You have been disconnected from the game. This can be because the game was concluded, server is offline, or that the has stopped working.'
          }
        });

        playSound('dialog');
      }
    });
  }
  toggleDeck = (deckCodeName) => () => {
    // Fail safe even though the checkbox is disabled.
    if(deckCodeName !== 'base-set') {
      const newState = this.state.game;
      const deckArray = newState.decks;
      const deckIndex = deckArray.indexOf(deckArray.find((deck) => {
        return deck.codeName === deckCodeName;
      }));
      deckArray[deckIndex].selected = !deckArray[deckIndex].selected;
      
      SOCKET.emit('updatedDecks', newState.decks);
      this.setState(newState);
    }
  }
  start = () => {
    SOCKET.emit('start');
  }
  playCard = (card) => () => {
    const isCzar = this.state.game.players.indexOf(this.state.game.players.find((player) => {
      return this.state.username === player.username;
    })) === this.state.game.gameState.czar;
    const clientPlayedCards = this.state.game.gameState.playedWhiteCards.find((object) => {
      return object.username === this.state.username;
    });
    
    let hasPlayedCards;
    if(clientPlayedCards) {
      hasPlayedCards = clientPlayedCards.cards.length === this.state.game.gameState.blackCard.pick;
    }

    // If the player can play cards.
    if(!isCzar && !hasPlayedCards) {
      const clientIndex = this.state.game.players.indexOf(this.state.game.players.find((player) => {
        return this.state.username === player.username;
      }));

      SOCKET.emit('playedCard', this.state.username, this.state.game.players[clientIndex].hand[card]);
      playSound('play');
    }
  }
  czarPick = (player) => () => {
    if(!this.state.game.gameState.czarHasPicked) {
      SOCKET.emit('czarPicked', player);
    }
  }
  disconnect = () => {
    SOCKET.emit('playerDisconnect', this.state.username);
    SOCKET.close();
    this.setState({
      connected: false,
      game: {}
    });
  }
  kill = () => {
    SOCKET.emit('kill');
  }
  closeDialog = () => {
    this.setState({
      dialog: { open: false }
    });
  };
  closeEndGameDialog = () => {
    this.setState({ endGameDialog: false });
  }
  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
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
              ? <Game
                username={this.state.username}
                game={this.state.game}
                disconnect={this.disconnect}
                start={this.start}
                playCard={this.playCard}
                czarPick={this.czarPick}
                kill={this.kill}
                decks={this.state.game.decks}
                toggleDeck={this.toggleDeck}
              />
              : <Start username={this.state.username} handleUsernameChange={this.handleUsernameChange} connect={this.connect} />
          }

          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={this.state.snackbarOpen}
            autoHideDuration={3000}
            TransitionComponent={TransitionLeft}
            onClose={this.handleSnackbarClose}
            ContentProps={{
              'aria-describedby': 'message-id'
            }}
            message={
              <span id='message-id'>{this.state.snackbarContent}</span>
            }
          />

          <Dialog
            open={this.state.dialog.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.closeDialog}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
          >
            <DialogTitle id='alert-dialog-slide-title'>{this.state.dialog.title}</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-slide-description'>
                {this.state.dialog.content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog} color='primary'>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            fullScreen
            open={this.state.endGameDialog}
            onClose={this.closeEndGameDialog}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <IconButton color='inherit' onClick={this.closeEndGameDialog} aria-label='Close'>
                <CloseIcon />
              </IconButton>
            </AppBar>
            <Typography variant='h4' style={{ textAlign: 'center', marginTop: '10px' }}>Game Summrary</Typography>
            <List>
              <ListItem>
                <ListItemText primary='Winner' secondary={this.state.winner} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary='Your Score' secondary={this.state.clientScore} />
              </ListItem>
            </List>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default hot(withStyles(styles)(App));
