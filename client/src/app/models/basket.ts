export type Basket= {
    basketId: string
    items: Item[]
  }
  
  export type Item = {
    productId: number
    name: string
    price: number
    brand: string
    type: string
    pictureUrl: string
    quantity: number
  }
  