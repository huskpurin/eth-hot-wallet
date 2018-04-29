var router = require('express').Router();
var web3 = require('./utils/web3');

function web3Middleware(req, res, next) {
  if(web3 && web3.isConnected()) {
    next();
  } else {
    next(new Error('Web3 Provider is not Connected'));
  }
}

router.get('/node', web3Middleware, (req, res, next) => {
  web3.admin.nodeInfo((error, result) => {
    if (!error){
      res.status(200).json({
        data: {
          enode: result.enode,
          name: result.name,
        },
      });
    } else {
      next(error);
    }
  });
});

router.get('/block/:blockNumber', web3Middleware, (req, res, next) => {
  const { blockNumber } = req.params;

  if (blockNumber) {
    web3.eth.getBlock(blockNumber, (error, result) => {
      if (!error) {
        res.status(200).json({
          data: result,
        });
      } else {
        next(error);
      }
    })
  }
});

module.exports = router;