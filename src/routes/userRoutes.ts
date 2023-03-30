import { Router } from 'express';
import { createUser, getUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/', getUser);
router.get('/all', getAllUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;