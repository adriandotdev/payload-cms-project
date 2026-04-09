'use client'

import { ProductsSelect } from '@/payload-types'
import { Where } from 'payload'
import { stringify } from 'qs-esm'
import { useEffect, useState } from 'react'

export const BuyPageClient: React.FC = () => {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<ProductsSelect[]>([])

  useEffect(() => {
    const handler = setTimeout(() => {
      const query: Where = {
        name: {
          contains: search,
        },
      }

      const stringifiedQuery = stringify({ where: query }, { addQueryPrefix: true })

      const fetchProducts = async () => {
        const result = await fetch(`/api/products${stringifiedQuery}`)
        const data = await result.json()
        setProducts(data.docs ?? [])
      }

      void fetchProducts()
    }, 300)

    return () => clearTimeout(handler)
  }, [search])

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <p>{JSON.stringify(products)}</p>
    </div>
  )
}
