var config = require('../config');
var Web3 = require('web3');
var web3 = new Web3();
var provider = new web3.providers.HttpProvider(
  config.get('httpProvider'),
  0,
  config.get('httpProviderUser'),
  config.get('httpProviderPassword')
);

web3.setProvider(provider);

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