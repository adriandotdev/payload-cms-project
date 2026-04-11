type PaymentSectionProps = {
  totalItems: number
  totalPrice: number
  cashTendered: string
  onCashTenderedChange: (value: string) => void
  onConfirm: () => void
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  totalItems,
  totalPrice,
  cashTendered,
  onCashTenderedChange,
  onConfirm,
}) => {
  const cash = parseFloat(cashTendered || '0')
  const change = cash - totalPrice
  const isValid = cash >= totalPrice && totalPrice > 0

  return (
    <>
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
            onChange={(e) => onCashTenderedChange(e.target.value)}
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
            <span className="text-sm font-medium">{isValid ? 'Change' : 'Insufficient'}</span>
            <span className="text-sm font-bold">
              {isValid ? `$${change.toFixed(2)}` : `$${Math.abs(change).toFixed(2)} short`}
            </span>
          </div>
        )}
        <button
          onClick={onConfirm}
          disabled={!isValid}
          className="w-full rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-neutral-900 text-white hover:bg-neutral-700"
        >
          Confirm Sale
        </button>
      </div>
    </>
  )
}
