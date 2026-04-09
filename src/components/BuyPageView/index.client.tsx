'use client'

import { ProductsSelect } from '@/payload-types'
import { useEffect, useState } from 'react'

export const BuyPageClient: React.FC = () => {
  const [products, setProducts] = useState<ProductsSelect | []>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await fetch('/api/products')

      const data = await result.json()
      console.log(data)
    }

    void fetchProducts()
  }, [])

  return <div>Hello from client</div>
}
