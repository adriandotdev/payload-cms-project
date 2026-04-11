import { Product } from '@/payload-types'

type CartItemProps = {
  product: Product
  qty: number
  onUpdateQty: (product: Product, delta: number) => void
  variant?: 'desktop' | 'mobile'
}

export const CartItem: React.FC<CartItemProps> = ({
  product,
  qty,
  onUpdateQty,
  variant = 'desktop',
}) => {
  const btnSize = variant === 'mobile' ? 'size-8' : 'size-7'

  const categoryBadge =
    typeof product.category === 'object' && product.category?.name ? (
      <span className="w-fit rounded-full bg-neutral-100 px-2 py-0.5 text-base text-neutral-500">
        {product.category.name}
      </span>
    ) : null

  if (variant === 'mobile') {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex flex-col gap-2 dark:bg-[#222222] dark:border-gray-900">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-base font-semibold text-neutral-900 leading-tight dark:text-white">
            {product.name}
          </h1>
          <p className="text-lg font-bold text-neutral-900 shrink-0 dark:text-white">
            ${(product.price * qty).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdateQty(product, -1)}
            className={`${btnSize} rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors dark:bg-[#222222] dark:text-white dark:hover:bg-black`}
          >
            −
          </button>
          <span className="text-base font-medium text-neutral-900 w-4 text-center dark:text-white">
            {qty}
          </span>
          <button
            onClick={() => onUpdateQty(product, 1)}
            className={`${btnSize} rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors dark:bg-[#222222] dark:text-white dark:hover:bg-black`}
          >
            +
          </button>
        </div>
        {categoryBadge}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow dark:bg-[#222222] dark:border-gray-900">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 truncate dark:text-white">
          {product.name}
        </p>
        {categoryBadge}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onUpdateQty(product, -1)}
          className={`${btnSize} rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors dark:bg-[#222222] dark:text-white dark:hover:bg-black`}
        >
          −
        </button>
        <span className="text-base font-medium text-neutral-900 w-4 text-center dark:text-white">
          {qty}
        </span>
        <button
          onClick={() => onUpdateQty(product, 1)}
          className={`${btnSize} rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors dark:bg-[#222222] dark:text-white dark:hover:bg-black`}
        >
          +
        </button>
        <p className="text-sm font-bold text-neutral-900 w-16 text-right dark:text-white">
          ${(product.price * qty).toFixed(2)}
        </p>
      </div>
    </div>
  )
}
