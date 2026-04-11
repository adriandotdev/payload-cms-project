'use client'

import { useField } from '@payloadcms/ui'

interface ColorFieldProps {
  path: string
}

import type { FC } from 'react'

export const ColorField: FC<ColorFieldProps> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })

  return (
    <div>
      <label>Color: </label>
      <input
        className="w-full h-12"
        type="color"
        value={value || '#ffffff'}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

export default ColorField
