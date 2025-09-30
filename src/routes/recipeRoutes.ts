import { Router } from 'express';
import { getRecipeById } from '../controllers/recipeController';

const router = Router()

router.get('/:id', getRecipeById);

export default router;