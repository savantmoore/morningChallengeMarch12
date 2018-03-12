const express = require('express');
const router = express.Router();

const PlayerBusiness = require('../business/playerBusiness');

/* GET api listing. */
router.get('/', (req, res) => {
	res.send('api works');
});

router.post('/action/getPlayerByName', function(req, res) {
	PlayerBusiness.getPlayerByName(req.body, res);
});

router.post('/action/upsertPlayer', function(req, res) {
	PlayerBusiness.upsertPlayer(req.body, res);
});



module.exports = router;