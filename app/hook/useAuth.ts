import { useEffect, useState } from 'react'

export default function useAuth() {
  const [utilisateur, setUtilisateur] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) throw new Error()
        const data = await res.json()
        setUtilisateur(data.utilisateur)
      } catch {
        setUtilisateur(null)
      } finally {
        setChargement(false)
      }
    }

    fetchMe()
  }, [])

  return { utilisateur, chargement }
}
