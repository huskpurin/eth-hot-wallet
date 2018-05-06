const pick = require('lodash.pick');
const router = require('express').Router();
const Tx = require('ethereumjs-tx');
const { check } = require('express-validator/check');
const web3 = require('../../../utils/web3');
const web3Middleware = require('../../../middlewares/web3Middleware');
const formatValidationMiddleware = require('../../../middlewares/formatValidationMiddleware');

const transactionBodyValidator = [
  check('from')
    .exists().withMessage('the value of from should be set')
    .custom(web3.isAddress).withMessage('the value of from should be a valid address format'),
  check('to')
    .exists().withMessage('the value of to should be set')
    .custom(web3.isAddress).withMessage('the value of to should be a valid address format'),
  check('value')
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage('the value of value should be a number and larger than 0'),
  check('passphrase')
    .optional()
    .isString().withMessage('the value of passphrase should be a string'),
  check('privateKey')
    .optional()
    .isString().withMessage('the value of privateKey should be a string'),
  check('gas')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('the value of gas should be an int and greater than 0'),
  check('gasPrice')
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage('the value of gasPrice should be a number and larger than 0'),
];

router.get('/:transationHash', web3Middleware, (req, res, next) => {
  const { transationHash } = req.params;

  if (transationHash) {
    web3.eth.getTransaction(transationHash, (error, result) => {
      if (error) {
        return next(error);
      }

      if (!result) {
        const resErr = new Error('Not Found');
        resErr.status = 404;
        return next(resErr);
      }

      return res.status(200).json({
        data: pick(result, ['blockHash', 'blockNumber', 'from', 'gas', 'gasPrice', 'hash', 'nonce', 'to', 'value', 'input'])
      });
    });
  }
});

router.post('/',
  transactionBodyValidator,
  formatValidationMiddleware,
  web3Middleware,
  async (req, res, next) => {
    const params = req.body;
    let txCount;

    try {
      txCount = web3.eth.getTransactionCount(params.from);
    } catch (error) {
      return next(error);
    }

    const rawTx = rawTxFactory(params, txCount);

    try {
      const txHash = params.privateKey
        ? await sendTxByPrivateKey(rawTx, params.privateKey)
        : await sendTxByPassphrase(rawTx, params.passphrase);

      return res.status(200).json({
        data: {
          transactionHash: txHash,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

const DEFAULT_GAS = 90000;
const PROPS_TO_HEX = ['nonce', 'value', 'gas', 'gasPrice', 'data'];

function rawTxFactory({ from, to, value, gas, gasPrice, data, privateKey }, txCount) {
  const rawTx = {
    nonce: txCount,
    from,
    to,
    value,
    data,
  };

  if (privateKey) {
    rawTx.gas = gas || DEFAULT_GAS;
    rawTx.gasPrice = gasPrice || web3.eth.gasPrice;
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

module.exports = router;
