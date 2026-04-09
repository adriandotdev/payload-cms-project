import { User } from '@/payload-types'
import { Access, FieldAccess } from 'payload'

export const isAdmin: Access<User> = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}

export const isFieldAdmin: FieldAccess<any, User> = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}
