const router = require('express').Router();

router.use('/node', require('./node'));
router.use('/block', require('./block'));
router.use('/transaction', require('./transaction'));
router.use('/miner', require('./miner'));

module.exports = router;
