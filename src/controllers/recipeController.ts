import { Request, Response, NextFunction } from 'express';
import { Recipe, Product, ShoppingCart } from '../models/classes';

const products: Product[]= [
  new Product(1, 'prod1', 1, 'Liter', 5),
  new Product(2, 'prod2', 1, 'Liter', 10),
  new Product(3, 'prod3', 1, 'Liter', 8),
]
const recipes: Recipe[] = [
    new Recipe(1, 'test recipe', [
      { name: 'prod1', quantity: 1, unit: 'Liter' },
      { name: 'prod2', quantity: 2, unit: 'Liter' },
      { name: 'prod3', quantity: 2, unit: 'Liter' }
    ]),
]

export const getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { id } = req.params

    const recipe: Recipe = recipes.filter(r => r.id === Number(id))[0]

    res.status(200).json({ recipe })
  } catch (err) {
    next(err)
  }
}

export const createShoppingCartByRecipeId = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { email, recipeId } = req.body
    const shoppingCart = new ShoppingCart(Date.now(), email, [])

    const recipe = recipes.find(r => r.id === recipeId)

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
    } else {
      const { ingredients } = recipe
      ingredients.forEach(ingredient => {
        const product = products.find(p => p.name === ingredient.name && ingredient.unit === p.unit)
        if (product) {
            let unitCount = Math.ceil(ingredient.quantity / product.quantity)
            for (let i = 0; i < unitCount; i++) {
              shoppingCart.products.push(product)
            }
        }
      })

      res.status(200).json({ shoppingCart, totalPrice: shoppingCart.getTotalPrice()})
    }
  } catch (err) {
    next(err)
  }
}

