const express = require('express');
const tourController = require('./tourController');

const router = express.Router();

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
	.route('/')
	.get(tourController.getAllTours)
	.post(tourController.createTour);
router
	.route('/:id')
	.get(tourController.getTour)
	.delete(tourController.deleteTours);
module.exports = router;
