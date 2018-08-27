import express from 'express';

import userRouter from '../components/users/userRouter';
import mapboxRouter from '../components/mapbox/mapboxRouter';

const router = express.Router();

router.use('/users', userRouter);
router.use('/mapbox', mapboxRouter);

export default router;