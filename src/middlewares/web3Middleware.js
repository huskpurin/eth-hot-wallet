const web3 = require('../utils/web3');

function web3Middleware(req, res, next) {
  if(web3 && web3.isConnected()) {
    next();
  } else {
    next(new Error('Web3 Provider is not Connected'));
  }
}

module.exports = web3Middleware;
