const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { maybeUpload } = require('../middleware/upload');
const addressController = require('../controllers/addressController');

const router = express.Router();

router.post(
  '/save',
  auth,
  maybeUpload,
  [body('fullTextAddress').notEmpty(), body('location').notEmpty()],
  validate,
  addressController.saveAddress
);

router.get('/me', auth, addressController.getMyAddress);

router.put(
  '/update',
  auth,
  maybeUpload,
  [body('fullTextAddress').optional().notEmpty()],
  validate,
  addressController.updateAddress
);

router.get('/:publicCode', addressController.getByPublicCode);

module.exports = router;
