const RateLimit = require('express-rate-limit');
const router = require('express').Router();
const apiRouter = require('express').Router();
const v1Router = require('./api/v1/index');

const apiLimiter = new RateLimit({
  windowMs: 60 * 1000,
  max: 60,
  delayMs: 0,
});

router.use('/api', apiLimiter, apiRouter);

// api router
apiRouter.use('/v1', v1Router);

module.exports = router;
