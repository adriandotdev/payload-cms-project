import { isAdmin } from '@/access/isAdmin'
import type { Sale } from '@/payload-types'
import type { CollectionConfig } from 'payload'

export const Sales: CollectionConfig = {
  slug: 'sales',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'cashier', 'totalAmount', 'createdAt'],
  },
  access: {
    create: ({ req }) => req.context.salesTransaction === true,
    update: () => false,
    delete: isAdmin,
    read: isAdmin,
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
      admin: {
        initCollapsed: true,
      },
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
  endpoints: [
    {
      path: '/confirm',
      method: 'post',
      handler: async (req) => {
        if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

        const data = await req.json?.()
        if (!data) return Response.json({ error: 'Bad Request' }, { status: 400 })

        const sale = await req.payload.create({
          collection: 'sales',
          data: data as Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>,
          context: { salesTransaction: true },
          req,
        })
        return Response.json(sale)
      },
    },
  ],
}
