import { Router } from 'express';
import { createUser, getUser, getAllUsers, updateUser, deleteUser, deleteAllUsers } from '../controllers/userController';
import { Type, Static } from '@sinclair/typebox';
import { validateRequest } from 'typebox-express-middleware';

const router = Router();

router.get('/', validateRequest({
    query: Type.Object({
        email: Type.Optional(Type.String()),
        password: Type.Optional(Type.String()),
        userId: Type.Optional(Type.String()),
    }),
}), getUser);

router.get('/all', getAllUsers);

router.post('/', validateRequest({
    body: Type.Object({
        email: Type.String(),
        name: Type.String(),
        password: Type.String(),
        cellphone: Type.Number(),
        address: Type.String(),
    }),
}), createUser);

router.patch('/:id', validateRequest({
    body: Type.Object({
        email: Type.Optional(Type.String()),
        name: Type.Optional(Type.String()),
        password: Type.Optional(Type.String()),
        cellphone: Type.Optional(Type.Number()),
        address: Type.Optional(Type.String()),
    }),
}), updateUser);

router.delete('/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
}), deleteUser);

router.get('/deleteAll', deleteAllUsers);

export default router;