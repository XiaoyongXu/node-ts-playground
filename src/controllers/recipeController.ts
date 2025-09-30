import { Request, Response, NextFunction } from 'express';
import { Recipe, Product } from '../models/types'

const RECIPE_SERVICE_URL = "http://recipe-service-api.internal"

const products = [
  {
  id: '1',
  name: 'milk',
  price: {
    amount: 5,
    unit: 'CAD'
  },
  packageSize: {
    quantity: 1,
    unit: 'Liter'
  },
  inStock: true
}
]
const recipes: Recipe[] = [
   {
      id: '1',
      name: 'test recipe 1',
      description: 'test des',
      ingredients: [{ name: 'milk', quantity: 1, unit: 'Liter' }]
    },
]

export const getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { id } = req.params

    const recipe: Recipe = recipes.filter(r => r.id === id)[0]

    const { ingredients } = recipe

    const shoppingCart: Product[] = []
    ingredients.forEach((ing) => {
      const { name, quantity, unit } = ing
      const product = products.find(p => p.name === name) || null
      if (product) {
        if (product.packageSize.quantity === quantity) {
          shoppingCart.push(product)
        }
      }
    })
    res.status(200).json({ shoppingCart })
  } catch (err) {
    next(err)
  }
}

