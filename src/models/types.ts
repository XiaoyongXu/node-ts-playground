export interface Item {
  id: number
  name: string
}

export interface Product {
  id: string
  name: string
  price: {
    amount: number
    unit: string
  }
  packageSize: {
    quantity: number,
    unit: string
  }
  inStock: boolean
}

export interface Recipe {
  id: string
  name: string
  description: string
  ingredients: { name: string, quantity: number, unit: string }[]
}


export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

