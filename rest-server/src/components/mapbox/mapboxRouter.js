import express from 'express';
import { fetchUserLocationCoordinates } from './mapboxControllers';

const router = express.Router();

router.route('/:_id')
  .get(fetchUserLocationCoordinates);

export default router;