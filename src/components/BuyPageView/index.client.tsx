'use client'

import { Product } from '@/payload-types'
import { useAuth } from '@payloadcms/ui'
import { Where } from 'payload'
import { stringify } from 'qs-esm'
import { useEffect, useState } from 'react'
import { CartItem } from './CartItem'
import { PaymentSection } from './PaymentSection'
import { ProductCard } from './ProductCard'
import { SearchBar } from './SearchBar'

type CartItemData = {
  product: Product
  qty: number
}

export const BuyPageClient: React.FC = () => {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Record<number, CartItemData>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [cashTendered, setCashTendered] = useState('')
  const [open, setOpen] = useState(false)

  const cartItems = Object.values(cart)
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  const handleConfirm = () => {
    setOpen(true)
    // const confirmed = window.confirm('Complete this transaction?')

    // if (!confirmed) return

    // setCart({})
    // setCashTendered('')
    // setCartOpen(false)
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
        [product.id]: { product, qty: existing ? existing.qty + 1 : 1 },
      }
    })
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const query: Where = { name: { contains: search } }
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
    const handleWindowResize = () => setCartOpen(false)
    window.addEventListener('resize', handleWindowResize)
    if (cartOpen) document.body.style.overflowY = 'hidden'
    else document.body.style.overflowY = 'auto'
    return () => {
      window.removeEventListener('resize', handleWindowResize)
      document.body.style.overflowY = 'auto'
    }
  }, [cartOpen])

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product list */}
        <div className={`flex flex-col gap-4 mt-4 ${totalItems > 0 ? 'pb-20 lg:pb-10' : ''}`}>
          <SearchBar value={search} onChange={setSearch} />
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>

        {/* Desktop cart */}
        <div className="mt-4 hidden lg:flex lg:flex-col gap-4">
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white">Cart</h2>
          {cartItems.length === 0 ? (
            <p className="text-base text-neutral-400">No items yet.</p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.product.id}
                    product={item.product}
                    qty={item.qty}
                    onUpdateQty={handleUpdateQty}
                  />
                ))}
              </div>
              <PaymentSection
                totalItems={totalItems}
                totalPrice={totalPrice}
                cashTendered={cashTendered}
                onCashTenderedChange={setCashTendered}
                onConfirm={handleConfirm}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile cart */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 lg:hidden z-50">
          {cartOpen && (
            <div className="bg-white border-t border-neutral-200 shadow-xl h-[calc(100dvh-52px)] overflow-y-auto dark:bg-[#1a1a1a] dark:border-gray-900">
              <div className="px-4 pt-4 pb-2">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Cart</h2>
              </div>
              <div className="flex flex-col gap-3 px-4 pb-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.product.id}
                    product={item.product}
                    qty={item.qty}
                    onUpdateQty={handleUpdateQty}
                    variant="mobile"
                  />
                ))}
                <PaymentSection
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  cashTendered={cashTendered}
                  onCashTenderedChange={setCashTendered}
                  onConfirm={handleConfirm}
                />
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
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 sm:px-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm flex flex-col gap-4 p-6 border border-neutral-200 dark:border-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Confirm Transaction
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items summary */}
            <div className="flex flex-col gap-1.5 max-h-[35vh] sm:max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400 truncate mr-2">
                    {item.product.name}
                    <span className="ml-1 text-neutral-400">×{item.qty}</span>
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-white shrink-0">
                    ${(item.product.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-100 dark:border-gray-800" />

            {/* Totals */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">Total</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">Cash</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  ${parseFloat(cashTendered || '0').toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">Change</span>
                <span className="font-semibold text-green-600">
                  ${(parseFloat(cashTendered || '0') - totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-neutral-200 dark:border-gray-800 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#222222] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/sales/confirm', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        cashier: user?.id,
                        items: cartItems.map((item) => ({
                          product: item.product.id,
                          productName: item.product.name,
                          unitPrice: item.product.price,
                          qty: item.qty,
                          subtotal: parseFloat((item.product.price * item.qty).toFixed(2)),
                        })),
                        totalAmount: parseFloat(totalPrice.toFixed(2)),
                        cashTendered: parseFloat(cashTendered),
                        change: parseFloat((parseFloat(cashTendered) - totalPrice).toFixed(2)),
                      }),
                    })
                  } finally {
                    setOpen(false)
                    setCart({})
                    setCashTendered('')
                    setCartOpen(false)
                  }
                }}
                className="flex-1 rounded-xl bg-neutral-900 dark:bg-white py-2.5 text-sm font-semibold text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
