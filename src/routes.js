var router = require('express').Router();
var web3 = require('./utils/web3');

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

router.get('/node', web3Middleware, (req, res) => {
  web3.admin.nodeInfo((error, result) => {
    if (!error){
      res.status(200).json({
        data: {
          enode: result.enode,
          name: result.name,
        },
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
});

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
    })
  }
});

module.exports = router;