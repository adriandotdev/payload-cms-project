import { Product } from '@/payload-types'

type ProductCardProps = {
  product: Product
  onAddToCart: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow dark:bg-[#222222] dark:border-gray-900">
    <div className="flex items-start justify-between gap-2">
      <h1 className="text-xl font-semibold text-neutral-900 leading-tight dark:text-slate-50">
        {product.name}
      </h1>
      {typeof product.category === 'object' && product.category?.name && (
        <span className="shrink-0 rounded-full bg-black px-2 py-0.5 text-base text-white">
          {product.category.name}
        </span>
      )}
    </div>
    <p className="text-lg font-bold text-neutral-900 dark:text-slate-50">
      ${product.price.toFixed(2)}
    </p>
    <button
      onClick={() => onAddToCart(product)}
      className="mt-auto w-full rounded-xl bg-neutral-900 py-2 text-nomral font-medium text-white hover:cursor-pointer transition-colors dark:bg-[#222222] dark:border-[0.5px] dark:text-white"
    >
      Add
    </button>
  </div>
)
