'use client'

import { createContext, useContext } from 'react'

export type TUser = {
  id: string
  email: string
  prenom: string
  nom?: string
  association: string
  associationId: string
}

export const UserContext = createContext<TUser | null>(null)

export const useUser = () => useContext(UserContext)