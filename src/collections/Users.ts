import { isAdmin, isFieldAdmin } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      saveToJWT: true,
      access: {
        read: () => true,
        update: isFieldAdmin,
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
}
