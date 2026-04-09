import { isAdmin } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    delete: isAdmin,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        await req.payload.create({
          collection: 'audit_logs',

          data: {
            collection: 'products',
            action: operation,
            documentId: doc.id,

            performedBy: req.user?.id,

            before: previousDoc || null,
            after: doc,
          },
          context: {
            systemLog: true,
          },
        })
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await req.payload.create({
          collection: 'audit_logs',

          data: {
            collection: 'products',
            action: 'delete',
            documentId: doc.id,

            performedBy: req.user?.id,

            before: doc || null,
            after: null,
          },
          context: {
            systemLog: true,
          },
        })
      },
    ],
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
        afterRead: [({ value }) => parseFloat(parseFloat(value).toFixed(2))],
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
