const express = require('express');
const router = express.Router();
const { bookingController } = require('../../controllers');

const { bookingSchema } = require('../../schemas');
const { validateSchema } = require('../../middleware');

const { getUnbookedRooms, bookRoom, cancleRoom } = bookingController;

router.get('/bookings', getUnbookedRooms);
router.post('/bookings', validateSchema(bookingSchema), bookRoom);
router.put('/bookings', validateSchema(bookingSchema), cancleRoom);

module.exports = router;
