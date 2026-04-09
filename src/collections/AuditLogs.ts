import { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit_logs',
  admin: {
    useAsTitle: 'action',
  },
  access: {
    create: ({ req }) => {
      return req.context.systemLog === true
    },
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'collection',
      type: 'text',
    },
    {
      name: 'action',
      type: 'select',
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
      ],
    },
    {
      name: 'documentId',
      type: 'text',
    },
    {
      name: 'performedBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'before',
      type: 'json',
    },
    {
      name: 'after',
      type: 'json',
    },
  ],
}
