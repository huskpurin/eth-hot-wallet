const pick = require('lodash.pick');
const router = require('express').Router();
const web3 = require('../../../utils/web3');
const web3Middleware = require('../../../middlewares/web3Middleware');

router.get('/:blockNumber', web3Middleware, (req, res, next) => {
  const { blockNumber } = req.params;

  if (blockNumber) {
    web3.eth.getBlock(blockNumber, (error, result) => {
      if (error) {
        return next(error);
      }

      if (!result) {
        const resErr = new Error('Not Found');
        resErr.status = 404;
        return next(resErr);
      }

      return res.status(200).json({
        data: pick(result, ['difficulty', 'gasLimit', 'gasUsed', 'hash', 'miner', 'parentHash', 'totalDifficulty']),
      });
    });
  }
});

module.exports = router;
