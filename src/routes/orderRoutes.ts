import express from 'express';
import { createOrder, getOrderById, getOrdersEnviados, getOrders, updateOrderItems, updateOrderStatus, deleteOrder } from '../controllers/orderController';
import { Type, Static } from '@sinclair/typebox';
import { validateRequest } from 'typebox-express-middleware';

const router = express.Router();

router.get('/search/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
}), getOrderById);

router.get('/', validateRequest({
    query: Type.Optional(Type.Object({
        user: Type.Optional(Type.String()),
        restaurant: Type.Optional(Type.String()),
        startDate: Type.Optional(Type.String()),
        endDate: Type.Optional(Type.String()),
        deliveryStatus: Type.Optional(Type.Union([
            Type.Literal('Enviado'),
            Type.Literal('Aceptado'),
            Type.Literal('Recibido'),
            Type.Literal('En dirección'),
            Type.Literal('Realizado'),
        ])),
    })),
}), getOrders);

router.get('/enviados', getOrdersEnviados);

router.post('/', validateRequest({
    body: Type.Object({
        restaurant: Type.String(),
        user: Type.String(),
        items: Type.Array(Type.Object({
            product: Type.String(),
            quantity: Type.Number(),
        })),
    }),
}), createOrder);

// Método para actualizar pedidos siendo un usuario
router.patch('/items/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
    body: Type.Object({
        items: Type.Array(Type.Object({
            product: Type.String(),
            quantity: Type.Number(),
        })),
    }),
}), updateOrderItems);

router.patch('/status/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
    body: Type.Object({
        deliveryStatus: Type.Union([
            Type.Literal('Enviado'),
            Type.Literal('Aceptado'),
            Type.Literal('Recibido'),
            Type.Literal('En dirección'),
            Type.Literal('Realizado'),
        ]),

    }),
}), updateOrderStatus);

router.delete('/:id', validateRequest({
    params: Type.Object({
        id: Type.String(),
    }),
}), deleteOrder);

export default router;
