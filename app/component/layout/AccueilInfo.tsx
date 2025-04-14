'use client'
import { useUser } from '@/context/UserContext'

export default function AccueilInfos() {
  const user = useUser()

  return <p className="text-gray-600 mb-6">Bienvenue <span className="font-semibold text-[#00B074]">{user?.prenom}</span> dans votre tableau de bord</p>
}
