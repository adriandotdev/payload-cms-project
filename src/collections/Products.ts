import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    delete: ({ req: { user } }) => {
      return Boolean(user?.role === 'admin')
    },
  },
  fields: [
    {
      type: 'text',
      name: 'name',
      required: true,
      validate: (value: any) => Boolean(value) || 'Product name is required',
    },
    {
      type: 'number',
      name: 'price',
      defaultValue: 0,
      min: 0,
      hooks: {
        afterRead: [({ value }) => parseFloat(value).toFixed(2)],
      },
      required: true,
      validate: (value: number | null | undefined) =>
        (value != null && value > 0) || 'Product price must be greater than zero.',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
  ],
}
