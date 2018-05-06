const Tx = require('ethereumjs-tx');
const { check, validationResult } = require('express-validator/check');
var v1Router = require('express').Router();
var web3 = require('../../utils/web3');

function web3Middleware(req, res, next) {
  if(web3 && web3.isConnected()) {
    next();
  } else {
    next(new Error('Web3 Provider is not Connected'));
  }
}

function formatValidationMiddleware(req, res, next) {
  const errors = validationResult(req).formatWith(({ msg, ...rest }) => ({ ...rest, message: msg }));

  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(422).json({ errors: errors.array() });
  }
}

v1Router.get('/node', web3Middleware, (req, res, next) => {
  var result = web3.admin.nodeInfo;

  res.status(200).json({
    data: {
      enode: result.enode,
      name: result.name,
    },
  });
});

v1Router.get('/block/:blockNumber', web3Middleware, (req, res, next) => {
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

v1Router.get('/transaction/:transationHash', web3Middleware, (req, res, next) => {
  const { transationHash } = req.params;

  if (transationHash) {
    web3.eth.getTransaction(transationHash, (error, result) => {
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

const transactionBodyValidator = [
  check('sender')
    .exists().withMessage('the value of sender should be set')
    .custom(web3.isAddress).withMessage('the value of sender should be a valid address format'),
  check('receiver')
    .exists().withMessage('the value of receiver should be set')
    .custom(web3.isAddress).withMessage('the value of receiver should be a valid address format'),
  check('ether')
    .optional({ nullable: true })
    .isFloat({ gt: 0 }).withMessage('the value of ether should be a number and larger than 0'),
  check('passphrase')
    .optional()
    .isString().withMessage('the value of passphrase should be a string'),
  check('privateKey')
    .optional()
    .isString().withMessage('the value of privateKey should be a string'),
  check('gas')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('the value of gas should be an int and greater than 0'),
  check('gasEther')
    .optional({ nullable: true })
    .isFloat({ gt: 0 }).withMessage('the value of gasEther should be a number and larger than 0'),
];

function rawTxFactory({ sender, receiver, ether, gas, gasEther, data, privateKey }) {
  const DEFAULT_GAS = 90000;
  const DEFAULT_GAS_PRICE = web3.eth.gasPrice;
  const PROPS_TO_HEX = ['nonce', 'value', 'gas', 'gasPrice', 'data'];

  const txCount = web3.eth.getTransactionCount(sender);
  const rawTx = {
    nonce: txCount,
    from: sender,
    to: receiver,
    data,
  };

  if (ether) {
    rawTx.value = web3.toWei(ether, 'ether');
  }

  if (privateKey) {
    rawTx.gas = gas || DEFAULT_GAS;
    rawTx.gasPrice = gasEther ? web3.toWei(gasEther, 'ether') : DEFAULT_GAS_PRICE;
  }

  PROPS_TO_HEX.forEach(key => {
    if (rawTx[key]) {
      rawTx[key] = web3.toHex(rawTx[key]);
    }
  });

  return rawTx;
}

async function sendTxByPrivateKey(rawTx, privateKey) {
  const tx = new Tx(rawTx);
  const signKey = Buffer.from(privateKey, 'hex');

  tx.sign(signKey);

  const serializedTx = tx.serialize();
  const signedTransactionData = '0x' + serializedTx.toString('hex');

  return new Promise((resolve, reject) => {
    web3.eth.sendRawTransaction(signedTransactionData, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

async function sendTxByPassphrase(rawTx, passphrase) {
  return new Promise((resolve, reject) => {
    web3.personal.sendTransaction(rawTx, passphrase, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

v1Router.post('/transaction',
  web3Middleware,
  transactionBodyValidator,
  formatValidationMiddleware,
  async function sendTransaction(req, res, next) {
    const params = req.body;
    const rawTx = rawTxFactory(params);

    try {
      const txHash = params.privateKey
        ? await sendTxByPrivateKey(rawTx, params.privateKey)
        : await sendTxByPassphrase(rawTx, params.passphrase);

      return res.status(200).json({
        data: {
          transactionHash: txHash,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

v1Router
  .route('/miner')
  .all(web3Middleware)
  .put((req, res, next) => {
    web3.miner.start(1, (error, result) => {
      if (!error) {
        res.status(204);
      } else {
        next(error);
      }
    })
  })
  .delete((req, res, next) => {
    web3.miner.end((error, result) => {
      if (!error) {
        res.status(204);
      } else {
        next(error);
      }
    })
  });

module.exports = v1Router;