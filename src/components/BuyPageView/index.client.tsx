'use client'

import { Product } from '@/payload-types'
import { Where } from 'payload'
import { stringify } from 'qs-esm'
import { useEffect, useState } from 'react'

type CartItem = {
  product: Product
  qty: number
}

export const BuyPageClient: React.FC = () => {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])

  const [cart, setCart] = useState<Record<number, CartItem>>({})
  const [cartOpen, setCartOpen] = useState(false)

  const cartItems = Object.values(cart)
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  const handleUpdateQty = (product: Product, delta: number) => {
    setCart((prev) => {
      const existing = prev[product.id]
      if (!existing) return prev
      const newQty = existing.qty + delta
      if (newQty <= 0) {
        const next = { ...prev }
        delete next[product.id]
        return next
      }
      return { ...prev, [product.id]: { product, qty: newQty } }
    })
  }

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev[product.id]

      return {
        ...prev,
        [product.id]: {
          product,
          qty: existing ? existing.qty + 1 : 1,
        },
      }
    })
  }

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`flex flex-col gap-4 mt-4 ${totalItems > 0 ? 'pb-20 lg:pb-0' : ''}`}>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 transition"
            />
          </div>
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-xl font-semibold text-neutral-900 leading-tight">
                  {product.name}
                </h1>
                {typeof product.category === 'object' && product.category?.name && (
                  <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-base text-neutral-500">
                    {product.category.name}
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-neutral-900">${product.price.toFixed(2)}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-auto w-full rounded-xl bg-neutral-900 py-2 text-nomral font-medium text-white hover:bg-neutral-700 transition-colors"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden lg:flex lg:flex-col gap-4">
          <h2 className="text-lg font-semibold text-neutral-900">Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-base text-neutral-400">No items yet.</p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {item.product.name}
                      </p>
                      {typeof item.product.category === 'object' && item.product.category?.name && (
                        <span className="w-fit rounded-full bg-neutral-100 px-2 py-0.5 text-base text-neutral-500">
                          {item.product.category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleUpdateQty(item.product, -1)}
                        className="size-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="text-base font-medium text-neutral-900 w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.product, 1)}
                        className="size-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                      >
                        +
                      </button>
                      <p className="text-sm font-bold text-neutral-900 w-16 text-right">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500">
                  {totalItems} item{totalItems !== 1 ? 's' : ''}
                </span>
                <span className="text-base font-bold text-neutral-900">
                  Total: ${totalPrice.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 lg:hidden z-50">
          {/* Drawer */}
          {cartOpen && (
            <div className="bg-white border-t border-neutral-200 shadow-xl max-h-[60vh] overflow-y-auto">
              <div className="px-4 pt-4 pb-2">
                <h2 className="text-base font-semibold text-neutral-900">Cart</h2>
              </div>
              <div className="flex flex-col gap-3 px-4 pb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h1 className="text-base font-semibold text-neutral-900 leading-tight">
                        {item.product.name}
                      </h1>
                      <p className="text-lg font-bold text-neutral-900 shrink-0">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQty(item.product, -1)}
                        className="size-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="text-base font-medium text-neutral-900 w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.product, 1)}
                        className="size-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    {typeof item.product.category === 'object' && item.product.category?.name && (
                      <span className="w-fit rounded-full bg-neutral-100 px-2 py-0.5 text-base text-neutral-500">
                        {item.product.category.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sticky bar */}
          <button
            onClick={() => setCartOpen((o) => !o)}
            className="w-full bg-neutral-900 text-white px-4 py-3 flex items-center justify-between shadow-lg"
          >
            <span className="text-sm font-medium">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold">${totalPrice.toFixed(2)}</span>
              <svg
                className={`size-4 transition-transform ${cartOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
