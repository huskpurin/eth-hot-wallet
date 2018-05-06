const pick = require('lodash.pick');
const router = require('express').Router();
const web3 = require('../../../utils/web3');
const web3Middleware = require('../../../middlewares/web3Middleware');

router.get('/', web3Middleware, (req, res, next) => {
  const result = web3.admin.nodeInfo;

  return res.status(200).json({
    data: pick(result, ['enode', 'name']),
  });
});

module.exports = router;
