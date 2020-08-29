const { StonksAPI } = require('@stonksjs/api');
const cheerio = require('cheerio');
const _ = require('lodash');

class Finviz {
  constructor() {
    this.api = new StonksAPI();
  }

  async request(url) {
    const { data, error } = await this.api.get(url);
    if (error) throw new Error(error);
    return data;
  }

  async getQuote(symbol) {
    if (!symbol) {
      return Promise.reject(Error('symbol is not defined'));
    }
    const url = `https://finviz.com/quote.ashx?t=${symbol}`;
    const data = await this.request(url);
    const symbols = this.parseQuoteData(data);
    return symbols;
  }

  parseQuoteData(html) {
    const $ = cheerio.load(html);
    const rows = $('.snapshot-table2 > tbody > tr');
    const data = {};
    let lastKey;
    rows.each((i, row) => {
      const cells = $(row).find('> td');
      cells.each((j, cell) => {
        const value = $(cell).text();
        if (j % 2 === 0) {
          lastKey = this.formatKey(value);
        } else {
          data[lastKey] = value;
        }
      });
    });
    return data;
  }

  async getScreenerResults(url) {
    if (!url) {
      return Promise.reject(Error('url is not defined'));
    }
    const data = await this.request(url);
    const symbols = this.getScreenerResultsSymbols(data);
    return symbols;
  }

  getScreenerResultsSymbols(html) {
    const $ = cheerio.load(html);
    const rows = $('#screener-content > table > tbody > tr');
    const data = new Set();
    rows.each((i, row) => {
      const cell = $(row).find('> td:nth-child(2)');
      if (cell.length) {
        data.add(cell.text());
      }
    });
    return [...data];
  }

  formatKey(key) {
    return _.camelCase(key);
  }
}

module.exports = Finviz;
