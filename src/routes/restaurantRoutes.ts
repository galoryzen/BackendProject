import { Router } from 'express';
import { createRestaurant, getRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController';

const router = Router();

router.get('/', getRestaurant);
router.get('/all', getAllRestaurants);
router.post('/', createRestaurant);
router.patch('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;