const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const placeController = require('../controllers/placeController');

const router = express.Router();

router.post(
  '/save',
  auth,
  [body('name').notEmpty(), body('location').notEmpty()],
  validate,
  placeController.savePlace
);

router.get('/me', auth, placeController.getMyPlaces);

router.put(
  '/update',
  auth,
  [body('placeId').notEmpty()],
  validate,
  placeController.updatePlace
);

router.delete('/:placeId', auth, placeController.deletePlace);

module.exports = router;

