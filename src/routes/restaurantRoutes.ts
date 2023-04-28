import { Router } from 'express';
import { createRestaurant, getRestaurant, getRestaurantById, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController';
import { Type, Static } from '@sinclair/typebox';
import { validateRequest } from 'typebox-express-middleware';


const router = Router();

router.get('/search/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
}), getRestaurantById);

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
}), createRestaurant);

router.patch('/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
    body: Type.Partial(Type.Object({
        name: Type.String(),
        address: Type.String(),
        category: Type.String(),
    })),
}), updateRestaurant);

router.delete('/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
}), deleteRestaurant);

export default router;