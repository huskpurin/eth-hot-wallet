const { check } = require('express-validator/check');
const router = require('express').Router();
const web3 = require('../../../utils/web3');
const web3Middleware = require('../../../middlewares/web3Middleware');
const formatValidationMiddleware = require('../../../middlewares/formatValidationMiddleware');

const bodyValidator = [
  check('cpus')
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage('the value of cpus should be an integer and larger than 0'),
];

router.put('/',
  bodyValidator,
  formatValidationMiddleware,
  web3Middleware,
  (req, res, next) => {
    const cpus = req.body.cpus || 1;

    web3.miner.start(cpus, (error, result) => {
      if (error) {
        return next(error);
      }

      return res.sendStatus(204);
    });
  }
);

router.delete('/', web3Middleware, (req, res, next) => {
  web3.miner.stop((error, result) => {
    if (error) {
      return next(error);
    }

    return res.sendStatus(204);
  });
});

module.exports = router;
