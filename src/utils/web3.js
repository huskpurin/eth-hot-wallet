var HTTP_PROVIDER = 'http://localhost:8545';
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(HTTP_PROVIDER));

web3._extend({
  property: 'admin',
  methods: [
    new web3._extend.Method({
        name: 'nodeInfo',
        call: 'admin_nodeInfo',
        params: 0,
    })
  ]
});

module.exports = web3;