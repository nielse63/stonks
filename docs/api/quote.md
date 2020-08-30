# `@stonksjs/quote`

> Object representing a single financial instrument, given a valid ticker symbol is provided

## Installation

```bash
npm install --save @stonksjs/quote
```

## Usage

```js
const StonksQuote = require('@stonksjs/quote');

const quote = new StonksQuote('MSFT');
const fundamentals = await quote.getFundamentals(); // returns object of fundamental data
```

## API

Full API docs can be found in the [`docs/`](./docs/api.md) folder
