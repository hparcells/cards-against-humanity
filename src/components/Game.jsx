import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { withStyles } from '@material-ui/core/styles';
import Beforeunload from 'react-beforeunload';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import SettingsIcon from '@material-ui/icons/Settings';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import WarningIcon from '@material-ui/icons/Warning';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import TheActualGame from './TheActualGame';

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  list: {
    width: 250
  }
});

class Game extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      adminPanelOpen: false,
      jsonDialog: false,
      customDeck: null
    };
  }

  toggleAdminPanel = (open) => () => {
    this.setState({ adminPanelOpen: open });
  }
  openDialog = () => {
    this.setState({ jsonDialog: true });
  }
  closeDialog = () => {
    this.setState({ jsonDialog: false });
  }
  chooseFile = (event) => {
    this.setState({ customDeck: event.target.files[0] });
  }
  closeAndSubmitFile = () => {
    if(this.state.customDeck) {
      this.props.newCustomDeck(this.state.customDeck)();
      this.setState({
        jsonDialog: false,
        customDeck: null
      });

      // Clear the file from the file select.
      document.getElementById('jsonFileSelect').value = '';
    }else {
      this.closeDialog();
    }
  }

  render() {
    const { classes, username, game, disconnect, start, playCard, czarPick, kill, decks, toggleDeck, toggleAllDecks } = this.props;

    const clientIndex = game.players.indexOf(game.players.find((player) => {
      return username === player.username;
    }));

    return (
      <div id='game-area'>
        <Beforeunload onBeforeunload={disconnect} />
        {
          !game.started
            ? <>
                {
                  game.players.length >= 4
                    ? username === game.players[0].username
                      ? <Button variant='contained' color='primary' className={classes.button} style={{ marginTop: '35px' }} onClick={start}>Start with {game.players.length} Players</Button>
                      : <Button variant='contained' color='primary' className={classes.button} style={{ marginTop: '35px' }} disabled onClick={start}>Start with {game.players.length} Players (Only the Host Can Start the Game)</Button>
                    : <Button variant='contained' color='primary' disabled className={classes.button} style={{ marginTop: '35px' }}>Start ({game.players.length} of 4 Players)</Button>
                }

                <Typography variant='h4' style={{ marginTop: '20px' }}>Select Decks to Use</Typography>
                <Button variant='outlined' color='primary' className={classes.button} onClick={toggleAllDecks}>Toggle All</Button>

                <Typography variant='h5'>Official</Typography>
                <FormGroup row>
                  {
                    decks.filter((deck) => deck.official).map((deck) => {
                      const codeName = deck.codeName;
                      const deckIndex = decks.findIndex((deck) => {
                        return deck.codeName === codeName;
                      });

                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={decks[deckIndex].selected}
                              onChange={toggleDeck(codeName)}
                              value='codeName'
                              color='primary'
                              disabled={clientIndex !== 0 || deck.codeName === 'base-set'}
                            />
                          }
                          label={deck.name}
                        />
                      );
                    })
                  }
                </FormGroup>
                <Typography variant='h5'>Unofficial</Typography>
                <Typography paragraph>[A] cards represent those decks found on <a href='https://crhallberg.com/cah/' target='_blank' rel='noreferrer noopener'>JSON Against Humanity</a>,
                  and [B] cards are the deck myself or friends have made.
                </Typography>
                <FormGroup row>
                  {
                    decks.filter((deck) => !deck.official && !deck.custom).map((deck) => {
                      const codeName = deck.codeName;
                      const deckIndex = decks.findIndex((deck) => {
                        return deck.codeName === codeName;
                      });

                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={decks[deckIndex].selected}
                              onChange={toggleDeck(codeName)}
                              value='codeName'
                              color='primary'
                              disabled={clientIndex !== 0}
                            />
                          }
                          label={deck.name}
                        />
                      );
                    })
                  }
                </FormGroup>
                <Typography variant='h5'>Custom</Typography>
                <Typography paragraph>Import your own JSON files to play with cards YOU want!</Typography>
                <FormGroup row>
                  {
                    /* TODO: Documentation link. */
                  }
                  <Button variant="outlined" color="primary" className={classes.button} disabled={clientIndex !== 0} onClick={this.openDialog}>Import JSON</Button>
                  {
                    decks.filter((deck) => deck.custom).map((deck) => {
                      const codeName = deck.codeName;
                      const deckIndex = decks.findIndex((deck) => {
                        return deck.codeName === codeName;
                      });

                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={decks[deckIndex].selected}
                              onChange={toggleDeck(codeName)}
                              value='codeName'
                              color='primary'
                              disabled={clientIndex !== 0}
                            />
                          }
                          label={deck.name}
                        />
                      );
                    })
                  }
                </FormGroup>

                <Typography variant='h4' style={{ marginTop: '20px' }} onClick={this.openDialog}>Connected Players</Typography>
                <ul>
                  {
                    game.players.map((player) => {
                      return (
                        <li>
                          <Typography>{
                            player.username === username
                              ? <strong>{player.username} (You)</strong>
                              : player.username
                          }</Typography>
                        </li>
                      );
                    })
                  }
                </ul>
              </>
            : <TheActualGame
              username={username}
              game={game}
              playCard={playCard}
              czarPick={czarPick}
            />
        }
        {
          clientIndex === 0
            ? <div id='admin-panel'>
              <Fab color='primary' aria-label='Settings' className={classes.fab} onClick={this.toggleAdminPanel(true)}>
                <SettingsIcon />
              </Fab>
              <SwipeableDrawer
                anchor='right'
                open={this.state.adminPanelOpen}
                onClose={this.toggleAdminPanel(false)}
                onOpen={this.toggleAdminPanel(true)}
              >
                <div
                  tabIndex={0}
                  role='button'
                  onKeyDown={this.toggleAdminPanel(false)}
                >
                  <Typography variant='h4' style={{
                    textAlign: 'center',
                    marginTop: '20px'
                  }}>Admin Panel</Typography>
                  <div className={classes.list}>
                    <List>
                      <ListItem button onClick={kill}>
                        <ListItemIcon><WarningIcon /></ListItemIcon>
                        <ListItemText primary='Kill Game' />
                      </ListItem>
                    </List>
                  </div>
                </div>
              </SwipeableDrawer>
            </div>
            : null
        }

        <Dialog
          open={this.state.jsonDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.closeDialog}
          aria-labelledby='alert-dialog-slide-title'
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle id='alert-dialog-slide-title'>Choose a JSON File...</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
              Submit a JSON file using the file input below.
              <input id='jsonFileSelect' type='file' accept='.json' onChange={this.chooseFile} />

              <Typography paragraph style={{ marginTop: '20px' }}>Don't know how to make a deck? Check out the documentation!</Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAndSubmitFile} color='primary'>
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default hot(withStyles(styles)(Game));
