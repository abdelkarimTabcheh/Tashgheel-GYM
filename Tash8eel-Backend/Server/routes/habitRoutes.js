// // routes/habitRoutes.js
// const router = require('express').Router();
// const auth = require('../middleware/auth');
// const ctrl = require('../controllers/habitController');

// router.get('/goals', auth, ctrl.getGoals);
// router.put('/goals', auth, ctrl.updateGoals);

// router.get('/entry', auth, ctrl.getEntry);
// router.post('/entry', auth, ctrl.upsertEntry);

// router.get('/stats', auth, ctrl.getStats);

// module.exports = router;















// // routes/habitRoutes.js
// const router = require('express').Router();
// const auth = require('../middleware/auth'); // must set req.userId!
// const ctrl = require('../controllers/habitController');

// router.get('/goals',   auth, ctrl.getGoals);
// router.put('/goals',   auth, ctrl.updateGoals);
// router.get('/entry',   auth, ctrl.getEntry);
// router.post('/entry',  auth, ctrl.upsertEntry);
// router.get('/summary', auth, ctrl.getSummary);
// router.get('/stats',   auth, ctrl.getStats);

// module.exports = router;

// routes/habitRoutes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/habitController');

router.get('/goals', auth, ctrl.getGoals);
router.put('/goals', auth, ctrl.updateGoals);

router.get('/entry', auth, ctrl.getEntry);
router.post('/entry', auth, ctrl.upsertEntry);

router.get('/summary', auth, ctrl.getSummary);
router.get('/stats', auth, ctrl.getStats);

module.exports = router;
