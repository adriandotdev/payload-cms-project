import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'text',
      name: 'name',
    },
    {
      type: 'text',
      name: 'color',
      admin: {
        components: {
          Field: '@/components/ColorInput/ColorField#default',
          Cell: '@/components/ColorInput/ColorColumnItem#ColorColumnItem',
        },
      },
    },
  ],
}
