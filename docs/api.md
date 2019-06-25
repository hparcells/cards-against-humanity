# API
> Get data with the REST API.


## Table of Contents
- [API](#API)
  - [Table of Contents](#Table-of-Contents)
  - [URL](#URL)
  - [Endpoints](#Endpoints)
    - [/currentGame](#currentGame)
    - [/sets](#sets)
    - [/set/:set](#setset)
    - [randomWhiteCard/:set?](#randomWhiteCardset)
    - [randomBlackCard/:set?](#randomBlackCardset)

## URL
You can access the API through: `https://cah-game.herokuapp.com/api/`.

## Endpoints
### /currentGame
Gets the current game object of the running game.

### /sets
Lists all the valid set IDs available.

### /set/:set
Gets the data of a specified set. The `set` parameter has to be a valid set ID. Set IDs can be found through `/sets`.

### randomWhiteCard/:set?
Gets a random white card from a set. If so `set` parameter is provided, it grabs a random white card from the default deck. Set IDs can be found through `/sets`.

### randomBlackCard/:set?
Gets a random black card from a set. If so `set` parameter is provided, it grabs a random black card from the default deck. Set IDs can be found through `/sets`.

This only returns the text of the black card. It does not include how many white cards must be chosen.
