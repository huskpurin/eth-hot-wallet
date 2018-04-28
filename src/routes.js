var router = require('express').Router();

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

function web3Middleware(req, res, next) {
  if(web3 && web3.isConnected()) {
    next();
  } else {
    res.status(500).json({
      data: null,
      statusCode: 500,
      message: 'Web3 provider have not been set.',
    });
  }
}

router.get('/block/:blockNumber', web3Middleware, (req, res) => {
  const { blockNumber } = req.params;

  if (blockNumber) {
    web3.eth.getBlock(blockNumber, (error, result) => {
      if (!error) {
        res.status(200).json({
          data: result,
          statusCode: 200,
          message: 'success',
        });
      } else {
        res.status(500).json({
          error,
          statusCode: 500,
          message: 'something wrong',
        });
      }
    });
  }
});

module.exports = router;