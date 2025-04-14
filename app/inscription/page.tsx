"use client"

import { useState } from "react"
import Link from "next/link"
import WrapperVitrine from "../component/layout/WrapperVitrine"

export default function InscriptionPage() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    siret: "",
    telephone: "",
    type: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Soumission de l'association :", formData)
    // TODO: POST vers /api/inscription
  }

  return (
    <WrapperVitrine>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-8">
          <h1 className="text-2xl font-bold text-center text-[#00B074] mb-6">
            Créer votre association
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom de l'association
              </label>
              <input
                type="text"
                name="nom"
                id="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email de contact
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074]"
              />
            </div>
            <div>
              <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
                Numéro SIRET
              </label>
              <input
                type="text"
                name="siret"
                id="siret"
                value={formData.siret}
                onChange={handleChange}
                required
                className="mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074]"
              />
            </div>
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="text"
                name="telephone"
                id="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                className="mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074]"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type d'association
              </label>
              <input
                type="text"
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Sportive, culturelle..."
                required
                className="mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe administrateur
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#00B074] text-white font-semibold py-2 rounded-md hover:bg-[#009a66] transition"
            >
              Créer mon association
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#00B074] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </WrapperVitrine>
  )
}
