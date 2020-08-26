const StonksAPI = require('./StonksAPI');
const _ = require('lodash');

module.exports = class StonksFundamentalsAPI extends StonksAPI {
  static dataKeyConversionHash = {
    Beta: 'beta',
    Ch: 'change',
    Chp: 'changePercent',
    Cmp: 'fullCompanyName',
    Cur: 'currency',
    Dh: 'dailyHigh',
    Dl: 'dailyLow',
    DvRt: 'dividendRate',
    Dy: 'dividendYield',
    Eps: 'eps',
    Eqsm: 'symbol',
    FpEPS: 'forwardPe',
    FrNm: 'name',
    Ind: 'industry',
    It: 'assetType',
    LoczExName: 'exchange',
    Lp: 'lastPrice',
    Pe: 'peRatio',
    PrCh1Mo: 'priceChange1Mo',
    PrCh3Mo: 'priceChange3Mo',
    PrCh6Mo: 'priceChange6Mo',
    Sec: 'sector',
    V: 'volume',
    Yh: 'yearHigh',
    Yl: 'yearLow',
    avgV: 'averageVolume',
    tz: 'timezone',
    Ask: 'askPrice',
    AskSize: 'askSize',
    Bid: 'bidPrice',
    BidSize: 'bidSize',
    Op: 'openingPrice',
    Pp: 'previousClosePrice',
    YTD: 'yearToDateChange',
    market: 'market',
  };

  constructor(ticker) {
    const symbol = ticker.toUpperCase();
    const url = `https://finance-services.msn.com/Market.svc/ChartAndQuotes?symbols=126.1.${symbol}&lang=en-US&chartType=1y`;
    const options = {
      headers: {
        Referer: 'https://www.msn.com/en-us/money/stockdetails/fi-a2f4r7',
      },
    };
    super(url, options);
  }

  toJSON() {
    const quoteObject = _.get(this, 'response.data[0].Quotes', {});
    const parsedObject = _.pick(
      quoteObject,
      Object.keys(StonksFundamentalsAPI.dataKeyConversionHash)
    );
    return Object.entries(parsedObject).reduce((output, [key, value]) => {
      const newKey = StonksFundamentalsAPI.dataKeyConversionHash[key];
      return {
        ...output,
        [newKey]: value,
      };
    }, {});
  }

  async fetch() {
    this.response = await this.get();
    return this.toJSON();
  }
};
