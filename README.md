# cards-against-humanity
> Another Cards Against Humanity clone built in React.

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/ages-18.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/kinda-sfw.svg)](https://forthebadge.com)

[![Gitter](https://badges.gitter.im/cards-against-humanity-react/community.svg)](https://gitter.im/cards-against-humanity-react/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## Play
You can play the game at http://cards-against-humanity.surge.sh.

## Built With (Major Only)
- React
- Material UI
- Docsify (Documentation)
- Node.JS (Server)
- Socket.IO (Server)

### Server
The server was written in **Node.JS** along with **Socket.IO** and the code is at https://hparcells.github.io/cards-against-humanity/. The server primary action is to store the game data along with distribute it to the players when it is updated, while the client does minor logic before sending the action to the server.

## Motivation
The motovation for this project came from an idea to create some sort of card or board game within React, and I though a card game would be easier that a board game. This was also during the time when I was learning React and wanted to make a larger project then I ever have done before.

Development time took around two and a half weeks, way shorter than I though it would take, given that I was gone on a trip during that time as well.

## Future Roadmap
- [ ] Desktop App via **Electon**
- [ ] Fix, when player leaves they are still in game, problem

## Credits
- Hunter Parcells (Me): Almost the whole game.
- [Dave](https://github.com/imdaveead): Implementing animations for the cards.
