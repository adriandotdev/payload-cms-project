// src/collections/Sales.ts
import { isAdmin } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Sales: CollectionConfig = {
  slug: 'sales',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'cashier', 'totalAmount', 'createdAt'],
  },
  access: {
    create: ({ req }) => req.context.systemSale === true, // only via API endpoint
    update: () => false, // immutable — never edit a sale
    delete: isAdmin,
  },
  fields: [
    // Who sold it
    {
      name: 'cashier',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    // Line items — snapshot prices at time of sale
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'productName', // snapshot — product may be renamed later
          type: 'text',
          required: true,
        },
        {
          name: 'unitPrice', // snapshot — price may change later
          type: 'number',
          required: true,
        },
        {
          name: 'qty',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
        },
      ],
    },

    // Payment
    { name: 'totalAmount', type: 'number', required: true },
    { name: 'cashTendered', type: 'number', required: true },
    { name: 'change', type: 'number', required: true },
  ],
  timestamps: true,
}
