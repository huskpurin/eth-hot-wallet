var HTTP_PROVIDER = 'http://localhost:8545';
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(HTTP_PROVIDER));

web3._extend({
  property: 'admin',
  properties: [
    new web3._extend.Property({
      name: 'nodeInfo',
      getter: 'admin_nodeInfo',
    }),
  ],
});

web3._extend({
  property: 'miner',
  methods: [
    new web3._extend.Method({
      name: 'start',
      call: 'miner_start',
      params: 1,
    }),
    new web3._extend.Method({
      name: 'end',
      call: 'miner_stop',
      params: 0,
    }),
  ],
});

module.exports = web3;