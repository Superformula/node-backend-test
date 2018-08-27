import express from 'express';

import userRouter from '../components/users/userRouter';

const router = express.Router();

router.use('/users', userRouter);

export default router;