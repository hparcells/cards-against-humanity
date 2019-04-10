# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
### Additions
- Sound
  - Playing a card.
  - When the Czar picks a card.
  - When someone wins.
  - When a dialog pops up.

### Changes
- New cards are drawn after the Czar picks.

### Fixes
- Fixed players can't join a game in progress.

### Known Bugs
- AFK players will softlock the game.
- The deck will run out and could have unintended consequences.
- There is an inconsistancy with players leaving making the game playable after a game ended.

## 1.1.0 [04/10/2019]
### Additions
- Connected players list in pre-game lobby.
- Shows everyone's picked cards once the Czar is ready.
- '>' indicator showing who the Czar is on the leaderboard.
- Added an "Admin Panel" where the host can kill the game if it stops working.
- More sets.
  - All sets labeled official on [JSON Against Humanity](https://crhallberg.com/cah/).
  - Sets I made including Programming Pack and Red Rising Pack.

### Changes
- The font of the cards more closely resembles the font on the actual card. It sill looks funky and I might change it later.
- The color of text on the white card is an off-black (#383838). Pure black looked weird.

### Known Bugs
- AFK players will softlock the game.
- The deck will run out and could have unintended consequences.
- Players can't join a game in progress.
- There is an inconsistancy with players leaving making the game playable after a game ended.

## 1.0.0 [04/01/2019]
### Additions
- Initial game.
