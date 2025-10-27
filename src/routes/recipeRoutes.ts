import { Router } from 'express';
import { getRecipeById, createShoppingCartByRecipeId } from '../controllers/recipeController';

const router = Router()

router.get('/:id', getRecipeById);

router.post('/shopping-cart', createShoppingCartByRecipeId);

export default router;