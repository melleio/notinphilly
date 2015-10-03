var express = require('express');
var controller = require('./streetSegment.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:sid', controller.get);
router.get('/filter/:nid', controller.getByNeighborhood);

module.exports = router;
