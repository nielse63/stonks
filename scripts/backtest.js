#!/usr/bin/env node
const env = require('../api/lib/env');
const path = require('path');
const debug = require('debug')('stonks:backtest');
const _ = require('lodash');
const df = require('data-forge');
const fs = require('fs-extra');
const Backtest = require('../api/lib/Backtest');

const creds = {
  keyId: env.ALPACA_API_KEY,
  secretKey: env.ALPACA_API_SECRET,
  paper: env.ALPACA_PAPER_TRADING,
};

const filterResults = (array) => {
  const output = new df.DataFrame(array)
    .orderByDescending(({ profitPct }) => profitPct)
    .where(({ profitPct }) => profitPct > 10)
    .where(({ results }) => {
      const {
        lastIndicator: { period1, period2 },
      } = results;
      return period1 > period2;
    })
    .dropSeries('results')
    .toArray();
  return output;
};

const readRecommendations = () => {
  const recsfilepath = path.resolve(__dirname, 'data/recommendations.json');
  const recommendations = fs.readJSONSync(recsfilepath, 'utf8');
  return recommendations;
};

const runSingleBacktest = async (object) => {
  const { symbol } = object;
  const backtest = new Backtest(symbol, creds);
  const results = await backtest.sma(5, 12, 25);
  const profitPct = _.get(results, 'analysis.profitPct', 0);
  return {
    ...object,
    profitPct,
    results,
  };
};

const writeBacktestResults = (array) => {
  const filepath = path.resolve(__dirname, 'data/backtest.json');
  const json = array.reduce((output, { symbol, results }) => {
    const object = { ...results };
    delete object.trades;
    return {
      ...output,
      [symbol]: object,
    };
  }, {});
  fs.writeJSONSync(filepath, json);
  debug('wrote backtest results to `backtest.json`');
};

const runBacktests = async (recommendations) => {
  const array = [];
  for (const recommendation of recommendations) {
    const testedObject = await runSingleBacktest(recommendation);
    if (testedObject.profitPct > 10) {
      array.push(testedObject);
    }
  }
  writeBacktestResults(array);
  const output = filterResults(array);
  return output;
};

const writeRecommendations = (json) => {
  const filepath = path.resolve(__dirname, 'data/recommendations.json');
  fs.writeJSONSync(filepath, json);
  debug('wrote post-backtest recommendations to `recommendations.json`');
};

const main = async () => {
  debug('running backtest');
  const recommendations = readRecommendations();
  const output = await runBacktests(recommendations);
  writeRecommendations(output);
  return output;
};

if (!module.parent) {
  (async () => {
    await main();
  })();
}

module.exports = main;