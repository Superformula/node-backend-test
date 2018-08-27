import express from 'express';

const router = express.Router();

router.route('/:_id')
  .get()
  .put()
  .delete();

router.route('/')
  .get()
  .post();

export default router;