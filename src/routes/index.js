const router = require('express').Router();
const apiRouter = require('express').Router();
const v1Router = require('./api/v1/index');

router.use('/api', apiRouter);

// api router
apiRouter.use('/v1', v1Router);

module.exports = router;
