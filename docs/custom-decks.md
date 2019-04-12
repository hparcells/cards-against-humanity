# Writing Custom Decks
> A way to play with cards you create.

Custom decks are written in a JSON file and imported before the game begins. This page will show you how to create decks and what you need.

## Getting Started
First off, you need to create a JSON file with two keys. `name` and `codeName`.

- `name` is a <u>string</u>, can be anything you want, and it will be what is shown in game.
- `codeName` is also <u>string</u>, and is the name the game uses to identify your deck. This must be unique from every other deck. If it is not unique, the JSON will not import and will notify you.

The bare-boned deck file should look like this:
```json
{
  "name": "Custom Deck #1",
  "codeName": "custom-deck-1"
}
```

> [!WARNING]
> If `name` and `codeName` are not present or are misspelled, the deck will not be added and you will be notified.

## Adding Cards
### Black Cards
Black cards are represented as objects in an array with the key of `blackCards`. Each black card object needs two keys, `text` and `pick`.

- The `text` key is a <u>string</u>, and the text that is shown in game on the card. You may use character entities which can be found at https://dev.w3.org/html5/html-author/charref. To add blanks to the card **only use one underscore**. You may also use HTML such as `<b>Bold</b>` and `Line 1<br />Line2`.
- The `pick` key is a <u>number</u>, and represents how many cards each player must pick to fulfill the black card. There is no limit to what you can, but **it should be no more than ten cards** as each player has ten cards and doesn't draw more until the next round.

An example of adding black cards should look like this:
```json
{
  "name": "Custom Deck #1",
  "codeName": "custom-deck-1",
  "blackCards": [
    {
      // Not using blanks.
      "text": "Why did the chicken cross the road?",
      "pick": 1
    },
    {
      // Using blanks and character entities.
      "text": "You like _? Well _&trade; is better!",
      "pick": 2
    }
  ]
}
```

### White Cards
Adding white cards are the easiest. You need to add an array with the key of `whiteCards`, and each array item will be a string.

An example of adding white cards is:
```json
{
  "name": "Custom Deck #1",
  "codeName": "custom-deck-1",
  "whiteCards": [
    "Yes",
    "No",
    "Maybe"
  ]
}
```

> [!TIP]
> Any cards that don't the same type (string, number, ...) will not be added to the game.

> [!TIP]
> Arrays `whiteCards` and `blackCards` are optional and don't need to be added for the deck to work.
