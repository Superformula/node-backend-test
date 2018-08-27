import express from 'express';
import { fetchLocationCoordinates } from './mapboxControllers';

const router = express.Router();

router.route('/:location')
  .get(fetchLocationCoordinates);

export default router;