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

import TheActualGame from './TheActualGame';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
    marginTop: '35px'
  },
  fab: {
    position: 'absolute',
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
      adminPanelOpen: false
    };
  }

  toggleAdminPanel = (open) => () => {
    this.setState({ adminPanelOpen: open });
  }

  render() {
    const { classes, username, game, disconnect, start, playCard, czarPick, kill, decks, toggleDeck } = this.props;

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
                      ? <Button variant='outlined' color='primary' className={classes.button} onClick={start}>Start with {game.players.length} Players</Button>
                      : <Button variant='outlined' color='primary' className={classes.button} disabled onClick={start}>Start with {game.players.length} Players (Only the Host Can Start the Game)</Button>
                    : <Button variant='outlined' color='primary' disabled className={classes.button}>Start ({game.players.length} of 4 Players)</Button>
                }

                <Typography variant='h4' style={{ marginTop: '20px' }}>Select Decks to Use</Typography>
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
                    decks.filter((deck) => !deck.official).map((deck) => {
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

                <Typography variant='h4' style={{ marginTop: '20px' }}>Connected Players</Typography>
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
            : <TheActualGame username={username} game={game} playCard={playCard} czarPick={czarPick} />
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
      </div>
    );
  }
}

export default hot(withStyles(styles)(Game));
