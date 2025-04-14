'use client'

import { createContext, useContext } from 'react'

type User = {
  id: string
  email: string
  prenom: string
  nom?: string
  association: string
  associationId: string
}

export const UserContext = createContext<User | null>(null)

export const useUser = () => useContext(UserContext)