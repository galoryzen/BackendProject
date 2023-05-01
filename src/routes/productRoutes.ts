import express from 'express';
import { createProduct, getProductById, getProducts, updateProduct, deleteProduct, getAllProducts } from '../controllers/productController';
import { Type, Static } from '@sinclair/typebox';
import { validateRequest } from 'typebox-express-middleware';

const router = express.Router();

router.get('/search/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
}), getProductById);

router.get('/restaurant/:id', validateRequest({
    query: Type.Optional(Type.Object({
        category: Type.Optional(Type.String()),
    })),
    params: Type.Object({
        id: Type.String(),
    }),
}), getProducts);

router.get('/', getAllProducts);

router.post('/', validateRequest({
    body: Type.Object({
        name: Type.String(),
        description: Type.Optional(Type.String()),
        price: Type.Number(),
        restaurant: Type.String(),
        category: Type.String(),
        status: Type.Optional(Type.Boolean())
    }),
}), createProduct);

router.patch('/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
    body: Type.Object({
        name: Type.Optional(Type.String()),
        description: Type.Optional(Type.String()),
        price: Type.Optional(Type.Number()),
        restaurant: Type.Optional(Type.String()),
        category: Type.Optional(Type.String()),
        status: Type.Optional(Type.Boolean())
    }),
}), updateProduct);

router.delete('/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
}), deleteProduct);

export default router;
