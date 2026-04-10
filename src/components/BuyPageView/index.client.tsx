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

  const [cashTendered, setCashTendered] = useState('')

  const cartItems = Object.values(cart)
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  const cash = parseFloat(cashTendered || '0')
  const change = cash - totalPrice
  const isValid = cash >= totalPrice && totalPrice > 0

  const handleConfirm = () => {
    setCart({})
    setCashTendered('')
    setCartOpen(false)
  }

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

  useEffect(() => {
    if (cartOpen) document.body.style.overflowY = 'hidden'
    else document.body.style.overflowY = 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [cartOpen])

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`flex flex-col gap-4 mt-4 ${totalItems > 0 ? 'pb-20 lg:pb-10' : ''}`}>
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
              className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 transition dark:bg-[#222222]"
            />
          </div>
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow dark:bg-[#222222] dark:border-gray-900"
            >
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-xl font-semibold text-neutral-900 leading-tight dark:text-slate-50">
                  {product.name}
                </h1>
                {typeof product.category === 'object' && product.category?.name && (
                  <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-base text-neutral-500">
                    {product.category.name}
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-neutral-900 dark:text-slate-50">
                ${product.price.toFixed(2)}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-auto w-full rounded-xl bg-neutral-900 py-2 text-nomral font-medium text-white  hover:cursor-pointer  transition-colors dark:bg-[#222222] dark:border-[0.5px] dark:text-white"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 hidden lg:flex lg:flex-col gap-4">
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white">Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-base text-neutral-400">No items yet.</p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow dark:bg-[#222222] dark:border-gray-900 "
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate dark:text-white">
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
                        className="size-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors dark:bg-[#222222] dark:text-white dark:hover:bg-black"
                      >
                        −
                      </button>
                      <span className="text-base font-medium text-neutral-900 w-4 text-center dark:text-white">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.product, 1)}
                        className="size-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors dark:bg-[#222222] dark:text-white dark:hover:bg-black"
                      >
                        +
                      </button>
                      <p className="text-sm font-bold text-neutral-900 w-16 text-right dark:text-white">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center justify-between dark:bg-[#222222] dark:border-gray-900">
                <span className="text-sm font-medium text-neutral-500 dark:text-white">
                  {totalItems} item{totalItems !== 1 ? 's' : ''}
                </span>
                <span className="text-base font-bold text-neutral-900 dark:text-white">
                  Total: ${totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:bg-[#222222] dark:border-gray-900">
                <p className="text-sm font-semibold text-neutral-700 dark:text-white">Payment</p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
                    ₱
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder="Cash tendered"
                    className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-7 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 transition"
                  />
                </div>
                {cashTendered !== '' && (
                  <div
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                      isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {isValid ? 'Change' : 'Insufficient'}
                    </span>
                    <span className="text-sm font-bold">
                      {isValid ? `$${change.toFixed(2)}` : `$${Math.abs(change).toFixed(2)} short`}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleConfirm}
                  disabled={!isValid}
                  className="w-full rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-neutral-900 text-white hover:bg-neutral-700"
                >
                  Confirm Sale
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 lg:hidden z-50">
          {/* Drawer */}
          {cartOpen && (
            <div className="bg-white border-t border-neutral-200 shadow-xl h-[calc(100dvh-52px)] overflow-y-auto dark:bg-[#1a1a1a] dark:border-gray-900">
              <div className="px-4 pt-4 pb-2">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Cart</h2>
              </div>
              <div className="flex flex-col gap-3 px-4 pb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex flex-col gap-2 dark:bg-[#222222] dark:border-gray-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h1 className="text-base font-semibold text-neutral-900 leading-tight dark:text-white">
                        {item.product.name}
                      </h1>
                      <p className="text-lg font-bold text-neutral-900 shrink-0 dark:text-white">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQty(item.product, -1)}
                        className="size-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors dark:bg-[#222222] dark:text-white dark:hover:bg-black"
                      >
                        −
                      </button>
                      <span className="text-base font-medium text-neutral-900 w-4 text-center dark:text-white">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.product, 1)}
                        className="size-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors dark:bg-[#222222] dark:text-white dark:hover:bg-black"
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

                <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:bg-[#222222] dark:border-gray-900">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-500 dark:text-white">
                      {totalItems} item{totalItems !== 1 ? 's' : ''}
                    </span>
                    <span className="text-base font-bold text-neutral-900 dark:text-white">
                      Total: ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
                      ₱
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      placeholder="Cash tendered"
                      className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-7 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 transition"
                    />
                  </div>
                  {cashTendered !== '' && (
                    <div
                      className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                        isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {isValid ? 'Change' : 'Insufficient'}
                      </span>
                      <span className="text-sm font-bold">
                        {isValid
                          ? `$${change.toFixed(2)}`
                          : `$${Math.abs(change).toFixed(2)} short`}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleConfirm}
                    disabled={!isValid}
                    className="w-full rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-neutral-900 text-white hover:bg-neutral-700"
                  >
                    Confirm Sale
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sticky bar */}
          <button
            onClick={() => setCartOpen((o) => !o)}
            className="w-full bg-neutral-900 text-white px-4 py-3 flex items-center justify-between shadow-lg"
          >
            <span className="text-lg font-medium">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
            </span>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
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
