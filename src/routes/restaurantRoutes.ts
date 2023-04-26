import { Router } from 'express';
import { createRestaurant, getRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController';
import { Type, Static } from '@sinclair/typebox';
import { validateRequest } from 'typebox-express-middleware';


const router = Router();

router.get('/', validateRequest({
    query: Type.Optional(Type.Object({
        name: Type.Optional(Type.String()),
        category: Type.Optional(Type.String()),
    })),
}), getRestaurant);

router.post('/', validateRequest({
    body: Type.Object({
        name: Type.String(),
        address: Type.String(),
        category: Type.String(),
    }),
}),createRestaurant);

router.patch('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;