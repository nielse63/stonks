const finviz = require('..');

const url = 'https://finviz.com/screener.ashx?v=111&s=ta_topgainers';
const symbol = 'AACG';

describe('@stonksjs/finviz', () => {
  it('should be defined', () => {
    expect(finviz).toBeDefined();
  });

  it('should be an object with two methods', () => {
    expect(finviz).toBeObject();
    expect(finviz.quote).toBeFunction();
    expect(finviz.search).toBeFunction();
  });

  describe('#quote', () => {
    it('should return an object of data', async () => {
      const response = await finviz.quote(symbol);
      expect(response).toBeObject();
    });
  });

  describe('#search', () => {
    it('should return an array of symbols', async () => {
      const response = await finviz.search(url);
      expect(response).toBeArray();
    });
  });
});
