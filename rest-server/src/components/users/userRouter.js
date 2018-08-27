import express from 'express';
import { addUser, fetchAllUser, fetchSingleUser, updateUser, deleteUser } from './userControllers';

const router = express.Router();

router.route('/:_id')
  .get(fetchSingleUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/')
  .get(fetchAllUser)
  .post(addUser);

export default router;